import "./RoutineDisplayCommentPopup.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { useRef, useState } from "react";
import useLazyLoading from "../../../Hooks/UseLazyLoading";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";

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
      <div className="comments-body">
        <input className="new-comment-input" ref={newCommentInputRef} />

        <div className="new-comment-buttons-container">
          <button>Cancel</button>
          <button onClick={handleCreateComment}>Comment</button>
        </div>

        <div>
          {[...comments, ...lazyLoaded].map((comment) => (
            <div className="workout-comment-container" key={comment.id}>
              <div className="workout-comment-header">
                <img
                  src={comment.creator.image ?? "/DefaultProfilePicture.png"}
                  alt={`Profile picture of a user named ${comment.creator.name}`}
                />
                <p>{comment.creator.name}</p>
                <p>{comment.createdAt}</p>
              </div>

              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
