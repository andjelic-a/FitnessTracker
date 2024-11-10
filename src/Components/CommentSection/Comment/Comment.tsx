import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import Icon from "../../Icon/Icon";
import { AnimatePresence, motion } from "framer-motion";
import formatDateSince from "../../../Utility/FormatDateSince";
import formatCount from "../../../Utility/FormatCount";
import CommentInputField from "../CommentInputField/CommentInputField";
import "./Comment.scss";
import basicProfileInfoContext from "../../../Contexts/BasicProfileInfoContext";

type CommentProps = {
  type: "workout" | "split";
  comment: CommentSchema;
  onCreateNewReply: () => void;
} & (ParentProps | ReplyProps);

type ParentProps = {
  isReply?: false;
  id: string;
};

type ReplyProps = {
  isReply: true;
  parentId: string;
  onReplyToChild: (
    newReply: Schema<"CreateWorkoutCommentRequestDTO">,
    newReplyId: string
  ) => void;
};

type CommentSchema =
  | Schema<"SimpleWorkoutCommentResponseDTO">
  | Schema<"SimpleSplitCommentResponseDTO">;

const Comment = React.memo<CommentProps>(
  ({ comment, onCreateNewReply, type, ...props }) => {
    const basicInfo = useContext(basicProfileInfoContext);

    const isWaitingForResponse = useRef<boolean>(false);
    const commentInputFieldRef = useRef<HTMLTextAreaElement>(null);

    const [isLiked, setIsLiked] = useState<boolean | null>(null);
    const [likeCount, setLikeCount] = useState<number>(0);

    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [replyCount, setReplyCount] = useState<number>(0);
    const [repliesExpanded, setRepliesExpanded] = useState<boolean>(false);

    const [replies, setReplies] = useState<{
      replies: CommentSchema[];
      newRepliesCount: number;
      reachedEnd: boolean;
    } | null>(null);

    useEffect(() => {
      setIsLiked(comment.isLiked);
      setLikeCount(comment.likeCount);
      setReplyCount(comment.replyCount);
    }, [comment]);

    async function getInitialReplies() {
      if (props.isReply) return;

      const awaitedReplies = replies;

      if (
        awaitedReplies &&
        awaitedReplies.replies.length !== 0 &&
        awaitedReplies.replies.length !== awaitedReplies.newRepliesCount
      )
        return;

      const data = await sendAPIRequest(
        type === "workout"
          ? "/api/workout/{workoutId}/comment/{commentId}/reply"
          : "/api/split/{splitId}/comment/{commentId}/reply",
        {
          method: "get",
          parameters: {
            commentId: comment.id,
            workoutId: props.id,
            splitId: props.id,
            limit: 10,
            offset: 0,
          },
        }
      );

      if (data.code !== "OK") return;

      setReplies((prev) =>
        prev
          ? {
              replies: [...prev.replies, ...data.content],
              reachedEnd: data.content.length < 10,
              newRepliesCount: prev.newRepliesCount,
            }
          : {
              replies: data.content,
              reachedEnd: data.content.length < 10,
              newRepliesCount: 0,
            }
      );
    }

    async function getMoreReplies() {
      if (props.isReply || !replies) return;

      const awaitReplies = replies;
      if (!awaitReplies || awaitReplies.reachedEnd) return;

      const data = await sendAPIRequest(
        type === "workout"
          ? "/api/workout/{workoutId}/comment/{commentId}/reply"
          : "/api/split/{splitId}/comment/{commentId}/reply",
        {
          method: "get",
          parameters: {
            commentId: comment.id,
            workoutId: props.id,
            splitId: props.id,
            limit: 10,
            offset: awaitReplies.replies.length - awaitReplies.newRepliesCount,
          },
        }
      );

      if (data.code !== "OK") return;

      setReplies((prev) => {
        prev = {
          replies: [...awaitReplies.replies, ...data.content],
          reachedEnd: data.content.length < 10,
          newRepliesCount: awaitReplies.newRepliesCount,
        };
        return prev;
      });
    }

    function handleLikeClick() {
      if (isWaitingForResponse.current) return;
      isWaitingForResponse.current = true;

      if (!isLiked) {
        if (type === "workout") {
          if (!("workoutId" in comment)) return;

          sendAPIRequest("/api/workout/{workoutId}/comment/{id}/like", {
            method: "post",
            parameters: {
              id: comment.id,
              workoutId: comment.workoutId,
            },
          }).then(() => void (isWaitingForResponse.current = false));
        } else
          sendAPIRequest("/api/split/comment/{id}/like", {
            method: "post",
            parameters: {
              id: comment.id,
            },
          });
      } else
        sendAPIRequest(`/api/${type}/comment/{id}/like`, {
          method: "delete",
          parameters: {
            id: comment.id,
          },
        }).then(() => void (isWaitingForResponse.current = false));

      setLikeCount((prevState) => prevState + (isLiked ? -1 : 1));
      setIsLiked((prevState) => !prevState);
    }

    function handleRepliesClick() {
      setRepliesExpanded((prevState) => !prevState);
    }

    function handleReplyBtnClick() {
      if (isReplying) commentInputFieldRef.current?.focus();
      else setIsReplying(true);
    }

    async function handleCreateReply(
      newReply: Schema<"CreateWorkoutCommentRequestDTO">
    ) {
      const response =
        type === "workout"
          ? await sendAPIRequest(
              "/api/workout/{workoutId}/comment/{commentId}/reply",
              {
                method: "post",
                parameters: {
                  workoutId: "workoutId" in comment ? comment.workoutId : "",
                  commentId: props.isReply ? props.parentId : comment.id,
                },
                payload: newReply,
              }
            )
          : await sendAPIRequest(
              "/api/split/{splitId}/comment/{commentId}/reply",
              {
                method: "post",
                parameters: {
                  splitId: "splitId" in comment ? comment.splitId : "",
                  commentId: props.isReply ? props.parentId : comment.id,
                },
                payload: newReply,
              }
            );

      if (response.code !== "Created") return;

      onCreateNewReply();

      if (!props.isReply)
        handleNewReplyUIUpdate(newReply, response.content.newCommentId);
      else props.onReplyToChild(newReply, response.content.newCommentId);
      setIsReplying(false);
    }

    async function handleNewReplyUIUpdate(
      newReply: Schema<"CreateWorkoutCommentRequestDTO">,
      newReplyId: string
    ) {
      if (props.isReply || !basicInfo) return;

      const newCommentSimulatedResponse: CommentSchema = {
        id: newReplyId,
        createdAt: new Date().toISOString(),
        creator: basicInfo,
        isCreator: true,
        isLiked: false,
        likeCount: 0,
        replyCount: 0,
        text: newReply.comment,
        workoutId: props.id,
      };

      setReplies((prev) =>
        prev
          ? {
              replies: [...prev.replies, newCommentSimulatedResponse],
              reachedEnd: prev.reachedEnd,
              newRepliesCount: prev.newRepliesCount + 1,
            }
          : {
              replies: [newCommentSimulatedResponse],
              reachedEnd: false,
              newRepliesCount: 1,
            }
      );
      setReplyCount((prevState) => prevState + 1);
    }

    useEffect(() => {
      if (!repliesExpanded || props.isReply) return;

      getInitialReplies();
    }, [repliesExpanded]);

    function handleShowMoreRepliesClick() {
      if (props.isReply || isWaitingForResponse.current) return;

      isWaitingForResponse.current = true;

      getMoreReplies().then(() => void (isWaitingForResponse.current = false));
    }

    const replyElements = useMemo(() => {
      if (!replies) return null;

      return (
        <div className="comment-replies-container">
          {replies.replies.map((reply) => (
            <Comment
              type={type}
              key={reply.id}
              onCreateNewReply={onCreateNewReply}
              isReply
              parentId={comment.id}
              comment={reply}
              onReplyToChild={(newReply, newReplyId) =>
                void (props.isReply
                  ? props.onReplyToChild(newReply, newReplyId)
                  : handleNewReplyUIUpdate(newReply, newReplyId))
              }
            />
          ))}

          {!replies.reachedEnd && (
            <div className="show-more" onClick={handleShowMoreRepliesClick}>
              <Icon name="long-arrow-down" />
              <p>Show more replies</p>
            </div>
          )}
        </div>
      );
    }, [replies]);

    return (
      <motion.div
        initial={{
          top: -33,
          opacity: 0,
          pointerEvents: "none",
        }}
        animate={{
          top: 0,
          opacity: 1,
          pointerEvents: "all",
        }}
        exit={{
          top: -25,
          opacity: 0,
          pointerEvents: "none",
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        style={{
          position: "relative",
        }}
        className={`workout-comment-container ${props.isReply ? "reply" : ""}`}
      >
        <div className="image-container">
          <img
            src={comment.creator.image ?? "/DefaultProfilePicture.png"}
            alt={`Profile picture of a user named ${comment.creator.name}`}
          />
        </div>

        <div className="main">
          <div className="header">
            <p className="name">@{comment.creator.name}</p>
            <p className="dot">●</p>
            <p className="date">
              {formatDateSince(new Date(comment.createdAt))}
            </p>
          </div>

          <div className="body">
            <p>{comment.text}</p>
          </div>

          <div className="footer">
            <div className="footer-interaction-container">
              <div className="like-container">
                <Icon
                  name="thumbs-up"
                  onClick={handleLikeClick}
                  className={`like-btn ${isLiked ? "active" : ""}`}
                />
                {likeCount > 0 && <p>{formatCount(likeCount)}</p>}
              </div>
              <button className="reply-btn" onClick={handleReplyBtnClick}>
                Reply
              </button>
            </div>

            {isReplying &&
              (!props.isReply ? (
                <CommentInputField
                  type="reply"
                  textAreaRef={commentInputFieldRef}
                  onSubmit={handleCreateReply}
                  onCancel={() => setIsReplying(false)}
                />
              ) : (
                <CommentInputField
                  type="nested-reply"
                  replyingTo={comment.creator}
                  textAreaRef={commentInputFieldRef}
                  onSubmit={handleCreateReply}
                  onCancel={() => setIsReplying(false)}
                />
              ))}

            {!props.isReply && replyCount > 0 && (
              <>
                <div
                  className="reply-count-container"
                  onClick={handleRepliesClick}
                >
                  <Icon name={`caret-${repliesExpanded ? "up" : "down"}`} />
                  <p>{formatCount(replyCount)} replies</p>
                </div>

                {repliesExpanded && <>{replyElements}</>}
                <AnimatePresence></AnimatePresence>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

export default Comment;
