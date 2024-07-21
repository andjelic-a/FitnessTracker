import "./RoutineDisplayCommentPopup.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { useRef, useState } from "react";
import useLazyLoading from "../../../Hooks/UseLazyLoading";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import WorkoutComment from "./Comment/WorkoutComment";

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
            <WorkoutComment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
