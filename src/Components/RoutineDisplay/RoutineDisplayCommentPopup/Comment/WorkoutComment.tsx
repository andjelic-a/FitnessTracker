import "./WorkoutComment.scss";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import Icon from "../../../Icon/Icon";
import { useCallback, useEffect, useRef, useState } from "react";
import sendAPIRequest from "../../../../Data/SendAPIRequest";
import formatDateSince from "../../../../Utility/FormatDateSince";
import Async from "../../../Async/Async";
import CommentInputField from "../CommentInputField/CommentInputField";

type WorkoutCommentProps = {
  comment: Schema<"SimpleWorkoutCommentResponseDTO">;
} & (ParentProps | ReplyProps);

type ParentProps = {
  isReply?: false;
  replies: Promise<{
    replies: Schema<"SimpleWorkoutCommentResponseDTO">[];
    reachedEnd: boolean;
  }> | null;
  index: number;
  requestReplies: (i: number) => void;
  onReply: (
    i: number,
    newReply: Schema<"CreateWorkoutCommentRequestDTO">
  ) => void;
};

type ReplyProps = {
  isReply: true;
  parentId: string;
  onReply: (newReply: Schema<"CreateWorkoutCommentRequestDTO">) => void;
};

export default function WorkoutComment({
  comment,
  ...props
}: WorkoutCommentProps) {
  const isWaitingForResponse = useRef<boolean>(false);

  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number>(0);

  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyCount, setReplyCount] = useState<number>(0);
  const [repliesExpanded, setRepliesExpanded] = useState<boolean>(false);

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
    newComment: Schema<"CreateWorkoutCommentRequestDTO">
  ) {
    sendAPIRequest("/api/workout/{workoutId}/comment/{commentId}/reply", {
      method: "post",
      parameters: {
        workoutId: comment.workoutId,
        commentId: props.isReply ? props.parentId : comment.id,
      },
      payload: newComment,
    });

    setIsReplying(false);
    if (!props.isReply) {
      setReplyCount((prevState) => prevState + 1);
      props.onReply(props.index, newComment);
    } else props.onReply(newComment);
  }

  const getReplies = useCallback(async () => {
    if (!props.isReply && props.replies) return props.replies;

    return Promise.resolve({
      replies: [],
      reachedEnd: false,
    });
  }, [props]);

  useEffect(() => {
    if (!repliesExpanded || props.isReply || props.replies) return;

    props.requestReplies(props.index);
  }, [repliesExpanded]);

  function handleShowMoreRepliesClick() {}

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
          <p className="date">{formatDateSince(new Date(comment.createdAt))}</p>
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

              {repliesExpanded && (
                <Async await={getReplies()}>
                  {(replies) => (
                    <div className="comment-replies-container">
                      {replies.replies.map((reply) => (
                        <WorkoutComment
                          key={reply.id}
                          isReply
                          parentId={comment.id}
                          onReply={(newReply) => {
                            if (props.isReply) return;

                            setReplyCount((prevState) => prevState + 1);
                            props.onReply(props.index, newReply);
                          }}
                          comment={reply}
                        />
                      ))}

                      {!replies.reachedEnd && (
                        <div
                          className="show-more"
                          onClick={handleShowMoreRepliesClick}
                        >
                          <Icon name="long-arrow-down" />
                          <p>Show more replies</p>
                        </div>
                      )}
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
