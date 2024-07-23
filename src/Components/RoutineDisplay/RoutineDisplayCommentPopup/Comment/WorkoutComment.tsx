import "./WorkoutComment.scss";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import Icon from "../../../Icon/Icon";
import { useEffect, useRef, useState } from "react";
import sendAPIRequest from "../../../../Data/SendAPIRequest";
import formatDateSince from "../../../../Utility/FormatDateSince";
import Async from "../../../Async/Async";
import CommentInputField from "../CommentInputField/CommentInputField";

type WorkoutCommentProps = {
  comment: Schema<"SimpleWorkoutCommentResponseDTO">;
  replies?: Promise<Schema<"SimpleWorkoutCommentResponseDTO">[]>;
  updateReplies?: (
    newReplies: Promise<Schema<"SimpleWorkoutCommentResponseDTO">[]>
  ) => void;
  parentId?: string;
  isReply?: boolean;
};

export default function WorkoutComment({
  comment,
  parentId,
  isReply,
  replies,
  updateReplies,
}: WorkoutCommentProps) {
  const isWaitingForResponse = useRef<boolean>(false);

  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);

  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyCount, setReplyCount] = useState<number>(0);
  const [repliesExpanded, setRepliesExpanded] = useState<boolean>(false);

  const currentRepliesPromiseRef = useRef<Promise<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  > | null>(null);

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

  async function getInitialReplies() {
    if (currentRepliesPromiseRef.current)
      return await currentRepliesPromiseRef.current;

    if (replies) return replies;

    const data = sendAPIRequest(
      "/api/workout/{workoutId}/comment/{commentId}/reply",
      {
        method: "get",
        parameters: {
          commentId: comment.id,
          workoutId: comment.workoutId,
          limit: 10,
          offset: 0,
        },
      }
    ).then((data) => {
      if (data.code !== "OK") return [];

      currentRepliesPromiseRef.current = null;
      return data.content;
    });

    currentRepliesPromiseRef.current = data;
    updateReplies?.(data);
    return data;
  }

  function handleReplyBtnClick() {
    setIsReplying(true);
  }

  function handleCreateReply(
    newComment: Schema<"CreateWorkoutCommentRequestDTO">
  ) {
    sendAPIRequest("/api/workout/{workoutId}/comment/{commentId}/reply", {
      method: "post",
      parameters: {
        workoutId: comment.workoutId,
        commentId: parentId ?? comment.id,
      },
      payload: newComment,
    }).then(() => {
      setReplyCount((prevState) => prevState + 1);
      setIsReplying(false);
    });
  }

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
          <p>{comment.creator.name}</p>
          <p>{formatDateSince(new Date(comment.createdAt))}</p>
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
            <button className="reply-button" onClick={handleReplyBtnClick}>
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

          {!isReply && replyCount > 0 && (
            <>
              <div
                className="reply-count-container"
                onClick={handleRepliesClick}
              >
                <Icon name={`caret-${repliesExpanded ? "up" : "down"}`} />
                <p>{replyCount} replies</p>
              </div>

              {repliesExpanded && (
                <Async await={replies ?? getInitialReplies()}>
                  {(replies) => (
                    <div className="workout-comment-reply-container">
                      {replies.map((reply) => (
                        <WorkoutComment
                          parentId={reply.id}
                          isReply
                          key={reply.id}
                          comment={reply}
                        />
                      ))}
                    </div>
                  )}
                </Async>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
