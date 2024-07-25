import "./WorkoutComment.scss";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import Icon from "../../../Icon/Icon";
import React, { useEffect, useMemo, useRef, useState } from "react";
import sendAPIRequest from "../../../../Data/SendAPIRequest";
import formatDateSince from "../../../../Utility/FormatDateSince";
import CommentInputField from "../CommentInputField/CommentInputField";
import { v4 } from "uuid";
import { getProfileCache } from "../../../../Pages/Profile/ProfileCache";

type WorkoutCommentProps = {
  comment: Schema<"SimpleWorkoutCommentResponseDTO">;
} & (ParentProps | ReplyProps);

type ParentProps = {
  isReply?: false;
  workoutId: string;
};

type ReplyProps = {
  isReply: true;
  parentId: string;
  onReplyToChild: (newReply: Schema<"CreateWorkoutCommentRequestDTO">) => void;
};

const WorkoutComment = React.memo<WorkoutCommentProps>(
  ({ comment, ...props }) => {
    const isWaitingForResponse = useRef<boolean>(false);

    const [isLiked, setIsLiked] = useState<boolean | null>(null);
    const [likeCount, setLikeCount] = useState<number>(0);

    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [replyCount, setReplyCount] = useState<number>(0);
    const [repliesExpanded, setRepliesExpanded] = useState<boolean>(false);

    const [replies, setReplies] = useState<{
      replies: Schema<"SimpleWorkoutCommentResponseDTO">[];
      newRepliesCount: number;
      reachedEnd: boolean;
    } | null>(null);

    async function requestReplies() {
      if (props.isReply) return;

      const awaitedReplies = replies;

      if (
        awaitedReplies &&
        awaitedReplies.replies.length !== 0 &&
        awaitedReplies.replies.length !== awaitedReplies.newRepliesCount
      )
        return;

      const data = await sendAPIRequest(
        "/api/workout/{workoutId}/comment/{commentId}/reply",
        {
          method: "get",
          parameters: {
            commentId: comment.id,
            workoutId: props.workoutId,
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

    async function requestMoreReplies() {
      if (props.isReply || !replies) return;

      const awaitReplies = replies;
      if (!awaitReplies || awaitReplies.reachedEnd) return;

      const data = await sendAPIRequest(
        "/api/workout/{workoutId}/comment/{commentId}/reply",
        {
          method: "get",
          parameters: {
            commentId: comment.id,
            workoutId: props.workoutId,
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

    useEffect(() => {
      setIsLiked(comment.isLiked);
      setLikeCount(comment.likeCount);
      setReplyCount(comment.replyCount);
    }, [comment]);

    function handleLikeClick() {
      if (isWaitingForResponse.current) return;
      isWaitingForResponse.current = true;

      sendAPIRequest("/api/workout/comment/{id}/like", {
        method: !isLiked ? "post" : "delete",
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
      setIsReplying(true);
    }

    function handleCreateReply(
      newReply: Schema<"CreateWorkoutCommentRequestDTO">
    ) {
      sendAPIRequest("/api/workout/{workoutId}/comment/{commentId}/reply", {
        method: "post",
        parameters: {
          workoutId: comment.workoutId,
          commentId: props.isReply ? props.parentId : comment.id,
        },
        payload: newReply,
      });

      if (!props.isReply) handleNewReplyUIUpdate(newReply);
      else props.onReplyToChild(newReply);
      setIsReplying(false);
    }

    async function handleNewReplyUIUpdate(
      newReply: Schema<"CreateWorkoutCommentRequestDTO">
    ) {
      const userData = getProfileCache();
      if (props.isReply || !userData) return;

      const user = await userData.user;
      if (user.code !== "OK") return;

      const newCommentSimulatedResponse: Schema<"SimpleWorkoutCommentResponseDTO"> =
        {
          id: v4(),
          createdAt: new Date().toISOString(),
          creator: user.content,
          isCreator: true,
          isLiked: false,
          likeCount: 0,
          replyCount: 0,
          text: newReply.comment,
          workoutId: props.workoutId,
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

      requestReplies();
    }, [repliesExpanded]);

    function handleShowMoreRepliesClick() {
      if (props.isReply || isWaitingForResponse.current) return;

      isWaitingForResponse.current = true;

      requestMoreReplies().then(
        () => void (isWaitingForResponse.current = false)
      );
    }

    const replyElements = useMemo(() => {
      if (!replies) return null;

      return (
        <div className="comment-replies-container">
          {replies.replies.map((reply) => (
            <WorkoutComment
              key={reply.id}
              isReply
              parentId={comment.id}
              comment={reply}
              onReplyToChild={(newReply) =>
                void (props.isReply
                  ? props.onReplyToChild(newReply)
                  : handleNewReplyUIUpdate(newReply))
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
      <div className="workout-comment-container">
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
                {likeCount > 0 && <p>{likeCount}</p>}
              </div>
              <button className="reply-btn" onClick={handleReplyBtnClick}>
                Reply
              </button>
            </div>

            {isReplying && (
              <CommentInputField
                type="reply"
                onSubmit={handleCreateReply}
                onCancel={() => setIsReplying(false)}
              />
            )}

            {!props.isReply && replyCount > 0 && (
              <>
                <div
                  className="reply-count-container"
                  onClick={handleRepliesClick}
                >
                  <Icon name={`caret-${repliesExpanded ? "up" : "down"}`} />
                  <p>{replyCount} replies</p>
                </div>

                {repliesExpanded && <>{replyElements}</>}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default WorkoutComment;
