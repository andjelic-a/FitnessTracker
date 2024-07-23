import "./WorkoutCommentSection.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { useRef } from "react";
import useLazyLoading from "../../../Hooks/UseLazyLoading";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import WorkoutComment from "./Comment/WorkoutComment";
import CommentInputField from "./CommentInputField/CommentInputField";

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

  useLazyLoading(".comment-section-wrapper", 0.7, onRequireLazyLoad);
  useOutsideClick(wrapperRef, onRequireClose);

  function handleCreateComment(
    newComment: Schema<"CreateWorkoutCommentRequestDTO">
  ) {
    sendAPIRequest("/api/workout/{workoutId}/comment", {
      method: "post",
      parameters: {
        workoutId,
      },
      payload: newComment,
    });
  }

  return (
    <div className="workout-display-comment-section" ref={wrapperRef}>
      <div className="comment-section-wrapper">
        <CommentInputField onSubmit={handleCreateComment} />

        <div className="workout-comments-body">
          {comments.map((comment) => (
            <WorkoutComment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
