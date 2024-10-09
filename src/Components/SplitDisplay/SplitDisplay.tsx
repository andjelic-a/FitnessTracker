import "./SplitDisplay.scss";
import WindowFC from "../WindowWrapper/WindowFC";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import splitDisplayLoader from "./SplitDisplayLoader";
import Async from "../Async/Async";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import extractWorkoutsFromSplit from "../../Utility/ExtractWorkoutsFromSplit";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import formatCount from "../../Utility/FormatCount";
import { useEffect, useRef, useState } from "react";
import sendAPIRequest from "../../Data/SendAPIRequest";

const SplitDisplay = WindowFC(() => {
  const loaderData = useLoaderData<typeof splitDisplayLoader>();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
  const [isCommentSectionOpen, setIsCommentSectionOpen] =
    useState<boolean>(false);

  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  const isWaitingForResponse = useRef<boolean>(false);
  const splitId = useRef<string>("");

  useEffect(() => {
    if (splitId.current.length > 0) return;

    isWaitingForResponse.current = true;

    loaderData?.split?.then((currentSplit) => {
      if (currentSplit.code !== "OK") return;

      isWaitingForResponse.current = false;
      splitId.current = currentSplit.content.id;
      setIsLiked(currentSplit.content.isLiked);
      setIsFavorited(currentSplit.content.isFavorited);

      setLikeCount(currentSplit.content.likeCount);
      setCommentCount(currentSplit.content.commentCount);
      setFavoriteCount(currentSplit.content.favoriteCount);
    });
  }, [loaderData]);

  const handleThumbsUpClick = () => {
    if (isWaitingForResponse.current) return;
    isWaitingForResponse.current = true;

    sendAPIRequest("/api/split/{id}/like", {
      method: !isLiked ? "post" : "delete",
      parameters: {
        id: splitId.current,
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

    sendAPIRequest("/api/split/{id}/favorite", {
      method: !isFavorited ? "post" : "delete",
      parameters: {
        id: splitId.current,
      },
    }).then(() => void (isWaitingForResponse.current = false));

    setFavoriteCount((prevState) => prevState + (isFavorited ? -1 : 1));
    setIsFavorited((prevState) => !prevState);
  };

  return (
    <div className="split-display-container">
      <div className="split-display">
        <Async await={loaderData?.split}>
          {(split) => {
            if (split.code !== "OK") return null;

            return (
              <>
                <div className="split-display-header">
                  <p className="split-display-title">{split.content.name}</p>

                  <div className="buttons">
                    <button
                      className="split-display-edit"
                      onClick={() => void navigate("edit")}
                    >
                      <Icon name="pen-to-square" />

                      <p className="accessibility-only" aria-hidden={false}>
                        Edit
                      </p>
                    </button>

                    <button
                      className="split-display-delete"
                      // onClick={() => void setIsConfirmDeletionModalOpen(true)}
                    >
                      <Icon name="trash" />

                      <p className="accessibility-only" aria-hidden={false}>
                        Delete
                      </p>
                    </button>
                  </div>
                </div>

                <div className="split-display-body">
                  {extractWorkoutsFromSplit(split.content).map((workout) => (
                    <div className="workout" key={workout.day}>
                      <h1>{workout.day}</h1>

                      {workout.workout === null ? (
                        <p>Rest</p>
                      ) : (
                        <WorkoutPreview workout={workout.workout} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="split-display-footer">
                  {split.content.description.trim().length > 0 && (
                    <div className="split-display-description-container">
                      <div className="split-display-description">
                        <label className="split-display-description-placeholder">
                          Split Description
                        </label>

                        {split.content.description}
                      </div>
                    </div>
                  )}

                  <div className="icon-container">
                    <div className="split-display-interaction-container">
                      <button onClick={handleThumbsUpClick}>
                        <Icon
                          name="thumbs-up"
                          className={`split-display-thumbs-up ${
                            isLiked ? "active" : ""
                          }`}
                        />
                      </button>

                      <p className="accessibility-only" aria-hidden={false}>
                        Like
                      </p>

                      <p className="split-display-interaction-count">
                        {formatCount(likeCount)}
                      </p>
                    </div>

                    <div className="split-display-interaction-container">
                      <button onClick={handleCommentClick}>
                        <Icon
                          name="comment"
                          className={`split-display-comment ${
                            isCommentSectionOpen ? "active" : ""
                          }`}
                        />
                      </button>

                      <p className="accessibility-only" aria-hidden={false}>
                        Comment section
                      </p>

                      <p className="split-display-interaction-count">
                        {formatCount(commentCount)}

                        <span
                          className="accessibility-only"
                          aria-hidden={false}
                        >
                          Comments
                        </span>
                      </p>
                    </div>

                    <div className="split-display-interaction-container">
                      <button onClick={handleFavoriteClick}>
                        <Icon
                          name="bookmark"
                          className={`split-display-bookmark ${
                            isFavorited ? "active" : ""
                          }`}
                        />
                      </button>

                      <p className="accessibility-only" aria-hidden={false}>
                        Favorite
                      </p>

                      <p className="split-display-interaction-count">
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
    </div>
  );
});

export default SplitDisplay;
