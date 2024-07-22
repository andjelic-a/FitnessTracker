import "./WorkoutComment.scss";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import Icon from "../../../Icon/Icon";
import { useEffect, useRef, useState } from "react";
import sendAPIRequest from "../../../../Data/SendAPIRequest";

export default function WorkoutComment({
  comment,
}: {
  comment: Schema<"SimpleWorkoutCommentResponseDTO">;
}) {
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  const [likeCount, setLikeCount] = useState<number>(0);
  const [replyCount, setReplyCount] = useState<number>(0);

  const isWaitingForResponse = useRef<boolean>(false);

  function formatDateSince(date: Date): string {
    const currentDate = new Date();
    const diff = currentDate.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} years ago`;
    } else if (months > 0) {
      return `${months} months ago`;
    } else if (weeks > 0) {
      return `${weeks} weeks ago`;
    } else if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
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
          <div className="like-container">
            <Icon
              name="thumbs-up"
              onClick={handleLikeClick}
              className={`like-btn ${isLiked ? "active" : ""}`}
            />
            {likeCount > 0 && <p>{likeCount}</p>}
          </div>
          <button className="reply-button">Reply</button>
        </div>
      </div>
    </div>
  );
}
