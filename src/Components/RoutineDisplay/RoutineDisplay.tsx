import "./RoutineDisplay.scss";
import { useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import RoutineDisplayItem from "./RoutineDisplayItem/RoutineDisplayItem";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import routineDisplayLoader from "./RoutineDisplayLoader";
import Async from "../Async/Async";
import WindowFC from "../WindowWrapper/WindowFC";
import { useNavigate } from "react-router-dom";
import { extractSetsNoMapping } from "../WorkoutsContainer/EditRoutine/ExtractSetsFromWorkout";
import sendAPIRequest from "../../Data/SendAPIRequest";
import {
  getProfileCache,
  setProfileCache,
} from "../../Pages/Profile/ProfileCache";
import WorkoutCommentSection from "./RoutineDisplayCommentPopup/WorkoutCommentSection";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import formatCount from "../../Utility/FormatCount";

const RoutineDisplay = WindowFC(({}, routineDisplayWrapperRef, close) => {
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

  const loaderData = useLoaderData<typeof routineDisplayLoader>();

  const [loadedComments, setLoadedComments] = useState<Promise<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  > | null>(null);

  const currentCommentPromiseRef = useRef<Promise<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  > | null>(null);

  const reachedEndInCommentSection = useRef<boolean>(false);

  useEffect(() => {
    isWaitingForResponse.current = true;

    loaderData?.routine?.then((currentWorkout) => {
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

  const handleCommentClick = () => {
    // routineDisplayWrapperRef.current!.scrollTop = 0;
    setIsCommentSectionOpen((prevState) => !prevState);
  };

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
    loaderData?.routine?.then((currentWorkout) => {
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

      const profileCache = getProfileCache();
      if (profileCache) {
        profileCache.workouts.then((workouts) => {
          if (workouts.code !== "OK") return;

          workouts.content = workouts.content.filter(
            (x) => x.id !== currentWorkout.content.id
          );
          setProfileCache(profileCache);
        });
      }

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

  return (
    <div ref={routineDisplayWrapperRef} className="routine-display-wrapper">
      <div className="routine-display">
        <div className="routine-display-header">
          <Async await={loaderData?.routine}>
            {(routine) => {
              if (!routine || routine.code !== "OK") return null;

              return (
                <>
                  <p className="routine-display-title">
                    {routine.content.name}
                  </p>
                  <button
                    className="routine-display-edit"
                    onClick={() => void navigate("edit")}
                  >
                    Edit
                  </button>
                  <button
                    className="routine-display-delete"
                    onClick={handleWorkoutDelete}
                  >
                    Delete
                  </button>
                </>
              );
            }}
          </Async>
        </div>

        <div className="routine-display-body">
          <Async await={loaderData?.routine}>
            {(routine) => {
              if (!routine || routine.code !== "OK") return null;

              return (
                <>
                  {extractSetsNoMapping(routine.content).map((set) => (
                    <RoutineDisplayItem
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

        <div className="routine-display-footer">
          <Async await={loaderData?.routine}>
            {(routine) => {
              if (!routine || routine.code !== "OK") return null;

              return (
                <>
                  {routine.content.description?.trim() !== "" ||
                    (routine.content.description && (
                      <div className="routine-display-description-container">
                        <div className="routine-display-description">
                          <label className="routine-display-description-placeholder">
                            Routine Description
                          </label>
                          {routine.content.description}
                        </div>
                      </div>
                    ))}
                  <div className="icon-container">
                    <div className="routine-display-interaction-container">
                      <Icon
                        name="thumbs-up"
                        onClick={handleThumbsUpClick}
                        className={`routine-display-thumbs-up ${
                          isLiked ? "active" : ""
                        }`}
                      />

                      <p>{formatCount(likeCount)}</p>
                    </div>

                    <div className="routine-display-interaction-container">
                      <Icon
                        onClick={handleCommentClick}
                        name="comment"
                        className={`routine-display-comment ${
                          isCommentSectionOpen ? "active" : ""
                        }`}
                      />

                      <p>{formatCount(commentCount)}</p>
                    </div>

                    <div className="routine-display-interaction-container">
                      <Icon
                        name="bookmark"
                        onClick={handleFavoriteClick}
                        className={`routine-display-bookmark ${
                          isFavorited ? "active" : ""
                        }`}
                      />

                      <p>{formatCount(favoriteCount)}</p>
                    </div>
                  </div>
                </>
              );
            }}
          </Async>
        </div>
      </div>

      {isCommentSectionOpen && (
        <Async await={loadedComments ?? getInitialComments()}>
          {(comments) => {
            return (
              <WorkoutCommentSection
                workoutId={workoutId.current}
                comments={comments}
                onRequireClose={handleCloseCommentPopup}
                onRequireLazyLoad={handleCommentLazyLoadRequest}
              />
            );
          }}
        </Async>
      )}
    </div>
  );
});

export default RoutineDisplay;
