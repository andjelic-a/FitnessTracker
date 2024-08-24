import "./WorkoutDisplay.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import WorkoutDisplayItem from "./WorkoutDisplayItem/WorkoutDisplayItem";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import workoutDisplayLoader from "./WorkoutDisplayLoader";
import Async from "../Async/Async";
import WindowFC from "../WindowWrapper/WindowFC";
import { useNavigate } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { getProfileCache } from "../../Pages/Profile/ProfileCache";
import WorkoutCommentSection from "./WorkoutDisplayCommentPopup/WorkoutCommentSection";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import formatCount from "../../Utility/FormatCount";
import { v4 } from "uuid";
import { AnimatePresence } from "framer-motion";
import { extractSetsNoMapping } from "../../Utility/ExtractSetsFromWorkout";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";

const WorkoutDisplay = WindowFC(({}, wrapperRef, close) => {
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
  const [isCommentSectionOpen, setIsCommentSectionOpen] =
    useState<boolean>(false);

  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  const isWaitingForResponse = useRef<boolean>(false);
  const workoutId = useRef<string>("");

  const loaderData = useLoaderData<typeof workoutDisplayLoader>();

  const [loadedComments, setLoadedComments] = useState<Promise<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  > | null>(null);
  const [createdComments, setCreatedComments] = useState<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  >([]);

  const currentCommentPromiseRef = useRef<Promise<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  > | null>(null);

  const reachedEndInCommentSection = useRef<boolean>(false);

  useEffect(() => {
    if (workoutId.current.length > 0) return;
    
    isWaitingForResponse.current = true;

    loaderData?.workout?.then((currentWorkout) => {
      if (currentWorkout.code !== "OK") return;

      isWaitingForResponse.current = false;
      workoutId.current = currentWorkout.content.id;
      setIsLiked(currentWorkout.content.isLiked);
      setIsFavorited(currentWorkout.content.isFavorited);

      setLikeCount(currentWorkout.content.likeCount);
      setCommentCount(currentWorkout.content.commentCount);
      setFavoriteCount(currentWorkout.content.favoriteCount);
    });
  }, [loaderData]);

  const handleThumbsUpClick = () => {
    if (isWaitingForResponse.current) return;
    isWaitingForResponse.current = true;

    sendAPIRequest("/api/workout/{id}/like", {
      method: !isLiked ? "post" : "delete",
      parameters: {
        id: workoutId.current,
      },
    }).then(() => void (isWaitingForResponse.current = false));

    setLikeCount((prevState) => prevState + (isLiked ? -1 : 1));
    setIsLiked((prevState) => !prevState);
  };

  const handleCommentClick = () =>
    void setIsCommentSectionOpen((prevState) => !prevState);

  function handleNewComment(
    newCommentRequest: Schema<"CreateWorkoutCommentRequestDTO">
  ) {
    const userData = getProfileCache();
    if (!userData) return;

    userData.user.then((user) => {
      if (user.code !== "OK") return;

      setCommentCount((prevState) => prevState + 1);

      const newCommentSimulatedResponse: Schema<"SimpleWorkoutCommentResponseDTO"> =
        {
          id: v4(),
          createdAt: new Date().toISOString(),
          creator: user.content,
          isCreator: true,
          isLiked: false,
          likeCount: 0,
          replyCount: 0,
          text: newCommentRequest.comment,
          workoutId: workoutId.current,
        };

      setCreatedComments((prev) => [newCommentSimulatedResponse, ...prev]);
    });
  }

  const handleFavoriteClick = () => {
    if (isWaitingForResponse.current) return;
    isWaitingForResponse.current = true;

    sendAPIRequest("/api/workout/{id}/favorite", {
      method: !isFavorited ? "post" : "delete",
      parameters: {
        id: workoutId.current,
      },
    }).then(() => void (isWaitingForResponse.current = false));

    setFavoriteCount((prevState) => prevState + (isFavorited ? -1 : 1));
    setIsFavorited((prevState) => !prevState);
  };

  const handleWorkoutDelete = () => {
    loaderData?.workout?.then((currentWorkout) => {
      if (currentWorkout.code !== "OK") {
        close();
        return;
      }

      sendAPIRequest("/api/workout/{id}", {
        method: "delete",
        parameters: {
          id: currentWorkout.content.id,
        },
      });

      //TODO: Update cache

      close();
    });
  };

  async function handleCommentLazyLoadRequest(): Promise<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  > {
    if (!loadedComments || reachedEndInCommentSection.current) return [];

    currentCommentPromiseRef.current ??= sendAPIRequest(
      "/api/workout/{workoutId}/comment",
      {
        method: "get",
        parameters: {
          workoutId: workoutId.current,
          limit: 10,
          offset: (await loadedComments).length,
        },
      }
    ).then((data) => {
      if (data.code !== "OK") return [];

      setLoadedComments((prev) =>
        prev!.then((prev) => [...prev, ...data.content])
      );

      reachedEndInCommentSection.current = data.content.length < 10;
      currentCommentPromiseRef.current = null;
      return [];
    });

    return await currentCommentPromiseRef.current;
  }

  async function getInitialComments(): Promise<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  > {
    currentCommentPromiseRef.current ??= sendAPIRequest(
      "/api/workout/{workoutId}/comment",
      {
        method: "get",
        parameters: {
          workoutId: workoutId.current,
          limit: 10,
          offset: 0,
        },
      }
    ).then((data) => {
      if (data.code !== "OK") return [];

      setLoadedComments(Promise.resolve(data.content));

      reachedEndInCommentSection.current = data.content.length < 10;
      currentCommentPromiseRef.current = null;
      return data.content;
    });

    return await currentCommentPromiseRef.current;
  }

  function handleCloseCommentPopup() {
    setIsCommentSectionOpen(false);
  }

  const commentSection = useMemo(() => {
    if (workoutId.current.length === 0) return <></>;

    return (
      <WorkoutCommentSection
        workoutId={workoutId.current}
        onRequireClose={handleCloseCommentPopup}
      />
    );
  }, [workoutId.current]);

  const commentSectionPortalNode = useMemo(() => createHtmlPortalNode(), []);

  return (
    <>
      <InPortal node={commentSectionPortalNode} children={commentSection} />

      <div ref={wrapperRef} className="workout-display-wrapper">
        <div className="workout-display">
          <div className="workout-display-header">
            <Async await={loaderData?.workout}>
              {(workout) => {
                if (!workout || workout.code !== "OK") return null;

                return (
                  <>
                    <p className="workout-display-title">
                      {workout.content.name}
                    </p>
                    <button
                      className="workout-display-edit"
                      onClick={() => void navigate("edit")}
                    >
                      Edit
                    </button>
                    <button
                      className="workout-display-delete"
                      onClick={handleWorkoutDelete}
                    >
                      Delete
                    </button>
                  </>
                );
              }}
            </Async>
          </div>

          <div className="workout-display-body">
            <Async await={loaderData?.workout}>
              {(workout) => {
                if (!workout || workout.code !== "OK") return null;

                return (
                  <>
                    {extractSetsNoMapping(workout.content).map((set) => (
                      <WorkoutDisplayItem
                        key={set.id}
                        exercise={set.exercise}
                        sets={set.sets}
                      />
                    ))}
                  </>
                );
              }}
            </Async>
          </div>

          <div className="workout-display-footer">
            <Async await={loaderData?.workout}>
              {(workout) => {
                if (!workout || workout.code !== "OK") return null;

                return (
                  <>
                    {workout.content.description?.trim() !== "" &&
                      workout.content.description && (
                        <div className="workout-display-description-container">
                          <div className="workout-display-description">
                            <label className="workout-display-description-placeholder">
                              Workout Description
                            </label>
                            {workout.content.description}
                          </div>
                        </div>
                      )}
                    <div className="icon-container">
                      <div className="workout-display-interaction-container">
                        <Icon
                          name="thumbs-up"
                          onClick={handleThumbsUpClick}
                          className={`workout-display-thumbs-up ${
                            isLiked ? "active" : ""
                          }`}
                        />

                        <p className="workout-display-interaction-count">
                          {formatCount(likeCount)}
                        </p>
                      </div>

                      <div className="workout-display-interaction-container">
                        <Icon
                          onClick={handleCommentClick}
                          name="comment"
                          className={`workout-display-comment ${
                            isCommentSectionOpen ? "active" : ""
                          }`}
                        />

                        <p className="workout-display-interaction-count">
                          {formatCount(commentCount)}
                        </p>
                      </div>

                      <div className="workout-display-interaction-container">
                        <Icon
                          name="bookmark"
                          onClick={handleFavoriteClick}
                          className={`workout-display-bookmark ${
                            isFavorited ? "active" : ""
                          }`}
                        />

                        <p className="workout-display-interaction-count">
                          {formatCount(favoriteCount)}
                        </p>
                      </div>
                    </div>
                  </>
                );
              }}
            </Async>
          </div>
        </div>

        <AnimatePresence>
          {isCommentSectionOpen && (
            <OutPortal node={commentSectionPortalNode} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

export default WorkoutDisplay;
