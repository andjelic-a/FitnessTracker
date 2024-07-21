import "./RoutineDisplayCommentPopup.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { useRef, useState } from "react";
import useLazyLoading from "../../../Hooks/UseLazyLoading";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import Icon from "../../Icon/Icon";

type RoutineDisplayCommentPopupProps = {
  workoutId: string;
  comments: Schema<"SimpleWorkoutCommentResponseDTO">[];
  onRequireLazyLoad: () => Promise<Schema<"SimpleWorkoutCommentResponseDTO">[]>;
  onRequireClose: () => void;
};

export default function RoutineDisplayCommentPopup({
  workoutId,
  comments,
  onRequireLazyLoad,
  onRequireClose,
}: RoutineDisplayCommentPopupProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [lazyLoaded, setLazyLoaded] = useState<
    Schema<"SimpleWorkoutCommentResponseDTO">[]
  >([]);

  const newCommentInputRef = useRef<HTMLInputElement>(null);

  useLazyLoading(wrapperRef.current!, 0.7, () => {
    onRequireLazyLoad().then((comments) => {
      setLazyLoaded((prev) => [...prev, ...comments]);
    });
  });

  useOutsideClick(wrapperRef, onRequireClose);

  function handleCreateComment() {
    sendAPIRequest("/api/workout/{workoutId}/comment", {
      method: "post",
      parameters: {
        workoutId: workoutId,
      },
      payload: {
        comment: newCommentInputRef.current!.value,
      },
    });
  }

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

  return (
    <div className="workout-display-comment-popup" ref={wrapperRef}>
      <div className="comment-section-wrapper">
        <div className="workout-comments-header">
          <input className="new-comment-input" ref={newCommentInputRef} />

          <div className="workout-comment-header-button-wrapper">
            <button>
              <p>Cancel</p>
            </button>

            <button onClick={handleCreateComment}>
              <p>Comment</p>
            </button>
          </div>
        </div>

        <div className="workout-comments-body">
          {[...comments, ...lazyLoaded].map((comment) => (
            <div className="workout-comment-container" key={comment.id}>
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
                  <Icon name="thumbs-up" />
                  <button className="reply-button">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
