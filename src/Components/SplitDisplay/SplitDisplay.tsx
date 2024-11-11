import "./SplitDisplay.scss";
import WindowFC from "../WindowWrapper/WindowFC";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import splitDisplayLoader from "./SplitDisplayLoader";
import Async from "../Async/Async";
import { Outlet, useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import extractWorkoutsFromSplit from "../../Utility/ExtractWorkoutsFromSplit";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import Description from "../Description/Description";
import formatCount from "../../Utility/FormatCount";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import CommentSection from "../CommentSection/CommentSection";
import ConfirmModalDialog from "../ConfirmModalDialog/ConfirmModalDialog";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

const SplitDisplay = WindowFC(() => {
  const loaderData = useLoaderData<typeof splitDisplayLoader>();
  const userInfo = useContext(basicProfileInfoContext);
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean | null>(null);
  const [isCommentSectionOpen, setIsCommentSectionOpen] =
    useState<boolean>(false);
  const [commentSectionPreviouslyOpen, setCommentSectionPreviouslyOpen] =
    useState<boolean>(false);

  const [likeCount, setLikeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);

  const isWaitingForResponse = useRef<boolean>(false);
  const splitId = useRef<string>("");

  const [isConfirmActivationModalOpen, setIsConfirmActivationModalOpen] =
    useState(false);

  useEffect(() => {
    if (splitId.current.length > 0) return;

    isWaitingForResponse.current = true;

    loaderData?.split?.then((currentSplit) => {
      if (currentSplit?.code !== "OK") return;

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
    if (!userInfo) {
      navigate("/authentication");
      return;
    }

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

  const handleFavoriteClick = () => {
    if (!userInfo) {
      navigate("/authentication");
      return;
    }

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

  function handleCloseCommentPopup() {
    setIsCommentSectionOpen(false);
  }

  const commentSectionPortalNode = useMemo(() => createHtmlPortalNode(), []);
  const commentSection = useMemo(() => {
    if (splitId.current.length === 0) return <></>;

    return (
      <CommentSection
        type="split"
        id={splitId.current}
        onRequireClose={handleCloseCommentPopup}
        onCreateNewComment={() => void setCommentCount((prev) => prev + 1)}
      />
    );
  }, [splitId.current]);

  async function handleActivate() {
    if (isWaitingForResponse.current || splitId.current.length === 0) return;
    isWaitingForResponse.current = true;

    sendAPIRequest("/api/user/split", {
      method: "patch",
      payload: {
        splitId: splitId.current,
      },
    }).then(() => {
      sessionStorage.setItem("revalidate-profile", "true");
      navigate(`..`);
      setIsConfirmActivationModalOpen(false);
    });
  }

  return (
    <div className="split-display-container">
      <InPortal
        node={commentSectionPortalNode}
        children={
          commentSectionPreviouslyOpen && isCommentSectionOpen && commentSection
        }
      />

      <div className="split-display">
        <Async await={loaderData?.split}>
          {(split) => {
            if (split?.code !== "OK") return null;

            return (
              <>
                <div className="split-display-header">
                  <p className="split-display-title">{split.content.name}</p>

                  <div className="buttons">
                    {userInfo != null &&
                      userInfo.username === split.content.creator.username && (
                        <button
                          className="split-display-edit"
                          onClick={() => void navigate("edit")}
                        >
                          <Icon name="pen-to-square" />

                          <p className="accessibility-only" aria-hidden={false}>
                            Edit
                          </p>
                        </button>
                      )}

                    <button
                      className="split-display-activate"
                      onClick={() => {
                        if (!userInfo) {
                          navigate("/authentication");
                          return;
                        }

                        if (!isWaitingForResponse.current)
                          setIsConfirmActivationModalOpen(true);
                      }}
                    >
                      <p>Set as active</p>
                    </button>
                  </div>
                </div>

                <div className="split-display-body">
                  {extractWorkoutsFromSplit(split.content).map((workout) => (
                    <div className="workout-container" key={workout.day}>
                      <div className="workout-container-wrapper">
                        <h3>{workout.day}</h3>

                        <div className="workout">
                          {workout.workout === null ? (
                            <>
                              <Icon className="rest-icon" name="mug-hot" />
                              <p className="rest">Rest</p>
                            </>
                          ) : (
                            <WorkoutPreview
                              className="split-workout-preview"
                              workout={workout.workout}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="split-display-footer">
                  <Description
                    placeholder="Split Description"
                    text={split.content.description.trim()}
                    isInputEnabled={false}
                  />
                  {/*{split.content.description.trim().length > 0 && (
                    <div className="split-display-description-container">
                      <div className="split-display-description">
                        <label className="split-display-description-placeholder">
                          Split Description
                        </label>

                        {split.content.description}
                      </div>
                    </div>
                  )}*/}

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
                      <button
                        onClick={() => {
                          if (
                            !commentSectionPreviouslyOpen &&
                            !isCommentSectionOpen
                          )
                            setCommentSectionPreviouslyOpen(true);

                          setIsCommentSectionOpen((prevState) => !prevState);
                        }}
                      >
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

      <AnimatePresence>
        {isCommentSectionOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 300,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 300,
            }}
            transition={{
              duration: 0.3,
              type: "just",
            }}
          >
            <OutPortal node={commentSectionPortalNode} />
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModalDialog
        isOpen={isConfirmActivationModalOpen}
        onConfirm={handleActivate}
        onDeny={() => void setIsConfirmActivationModalOpen(false)}
      >
        Are you sure you want to set this split as your active split?
        <br />
        This will <i>reset</i> all of your progress this week
      </ConfirmModalDialog>

      <Outlet />
    </div>
  );
});

export default SplitDisplay;
