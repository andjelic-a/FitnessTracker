import "./WorkoutCommentSection.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { useRef } from "react";
import useLazyLoading from "../../../Hooks/UseLazyLoading";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import WorkoutComment from "./Comment/WorkoutComment";

type WorkoutCommentSectionProps = {
  workoutId: string;
  comments: Schema<"SimpleWorkoutCommentResponseDTO">[];
  onRequireLazyLoad: () => void;
  onRequireClose: () => void;
};

export default function WorkoutCommentSection({
  workoutId,
  comments,
  onRequireLazyLoad,
  onRequireClose,
}: WorkoutCommentSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const newCommentInputRef = useRef<HTMLInputElement>(null);

  useLazyLoading(".comment-section-wrapper", 0.7, onRequireLazyLoad);
  useOutsideClick(wrapperRef, onRequireClose);

  function handleCreateComment() {
    sendAPIRequest("/api/workout/{workoutId}/comment", {
      method: "post",
      parameters: {
        workoutId,
      },
      payload: {
        comment: newCommentInputRef.current!.value,
      },
    });
  }

  return (
    <div className="workout-display-comment-section" ref={wrapperRef}>
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
          {comments.map((comment) => (
            <WorkoutComment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
