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
import formatCount from "../../Utility/FormatCount";
import { AnimatePresence } from "framer-motion";
import { extractSetsNoMapping } from "../../Utility/ExtractSetsFromWorkout";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import { motion } from "framer-motion";
import ConfirmModalDialog from "../ConfirmModalDialog/ConfirmModalDialog";
import CommentSection from "../CommentSection/CommentSection";
import Description from "../Description/Description";

const WorkoutDisplay = WindowFC(({}, close) => {
  const loaderData = useLoaderData<typeof workoutDisplayLoader>();
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

  const [isConfirmDeletionModalOpen, setIsConfirmDeletionModalOpen] =
    useState(false);

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

  const handleDelete = () => {
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

  function handleCloseCommentPopup() {
    setIsCommentSectionOpen(false);
  }

  const commentSection = useMemo(() => {
    if (workoutId.current.length === 0) return <></>;

    return (
      <CommentSection
        type="workout"
        id={workoutId.current}
        onRequireClose={handleCloseCommentPopup}
        onCreateNewComment={() => void setCommentCount((prev) => prev + 1)}
      />
    );
  }, [workoutId.current]);

  const commentSectionPortalNode = useMemo(() => createHtmlPortalNode(), []);

  const motionProps = useMemo(
    () => ({
      initial: {
        opacity: 0,
        y: 300,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        y: 300,
      },
      transition: {
        duration: 0.3,
        type: "just",
      },
    }),
    []
  );

  return (
    <>
      <InPortal node={commentSectionPortalNode} children={commentSection} />

      <div className="workout-display-container">
        <div className="workout-display">
          <Async await={loaderData?.workout}>
            {(workout) => {
              if (!workout || workout.code !== "OK") return null;

              return (
                <>
                  <div className="workout-display-header">
                    <p className="workout-display-title">
                      {workout.content.name}
                    </p>

                    <div className="buttons">
                      <button
                        className="workout-display-edit"
                        onClick={() => void navigate("edit")}
                      >
                        <Icon name="pen-to-square" />

                        <p className="accessibility-only" aria-hidden={false}>
                          Edit
                        </p>
                      </button>

                      <button
                        className="workout-display-delete"
                        onClick={() => void setIsConfirmDeletionModalOpen(true)}
                      >
                        <Icon name="trash" />

                        <p className="accessibility-only" aria-hidden={false}>
                          Delete
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="workout-display-body">
                    {extractSetsNoMapping(workout.content).map((set) => (
                      <WorkoutDisplayItem
                        key={set.id}
                        exercise={set.exercise}
                        sets={set.sets}
                      />
                    ))}
                  </div>

                  <div className="workout-display-footer">
                    <Description
                      placeholder="Workout Description"
                      text={workout.content.description?.trim()}
                      isInputEnabled = {false}
                    />

                    <div className="icon-container">
                      <div className="workout-display-interaction-container">
                        <button onClick={handleThumbsUpClick}>
                          <Icon
                            name="thumbs-up"
                            className={`workout-display-thumbs-up ${
                              isLiked ? "active" : ""
                            }`}
                          />
                        </button>

                        <p className="accessibility-only" aria-hidden={false}>
                          Like
                        </p>

                        <p className="workout-display-interaction-count">
                          {formatCount(likeCount)}
                        </p>
                      </div>

                      <div className="workout-display-interaction-container">
                        <button onClick={handleCommentClick}>
                          <Icon
                            name="comment"
                            className={`workout-display-comment ${
                              isCommentSectionOpen ? "active" : ""
                            }`}
                          />
                        </button>

                        <p className="accessibility-only" aria-hidden={false}>
                          Comment section
                        </p>

                        <p className="workout-display-interaction-count">
                          {formatCount(commentCount)}

                          <span
                            className="accessibility-only"
                            aria-hidden={false}
                          >
                            Comments
                          </span>
                        </p>
                      </div>

                      <div className="workout-display-interaction-container">
                        <button onClick={handleFavoriteClick}>
                          <Icon
                            name="bookmark"
                            className={`workout-display-bookmark ${
                              isFavorited ? "active" : ""
                            }`}
                          />
                        </button>

                        <p className="accessibility-only" aria-hidden={false}>
                          Favorite
                        </p>

                        <p className="workout-display-interaction-count">
                          {formatCount(favoriteCount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            }}
          </Async>
        </div>

        <AnimatePresence>
          {isCommentSectionOpen && (
            <motion.div {...motionProps}>
              <OutPortal node={commentSectionPortalNode} />
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmModalDialog
          isOpen={isConfirmDeletionModalOpen}
          onConfirm={handleDelete}
          onDeny={() => void setIsConfirmDeletionModalOpen(false)}
        >
          Are you sure you want to <b>permanently</b> delete this workout?
        </ConfirmModalDialog>
      </div>
    </>
  );
});

export default WorkoutDisplay;
