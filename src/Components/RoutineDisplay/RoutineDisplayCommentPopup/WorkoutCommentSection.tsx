import "./WorkoutCommentSection.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { useRef, useState } from "react";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import WorkoutComment from "./Comment/WorkoutComment";
import CommentInputField from "./CommentInputField/CommentInputField";
import useScrollTrigger from "../../../Hooks/UseScrollTrigger";
import { motion as Motion } from "framer-motion";

type WorkoutCommentSectionProps = {
  workoutId: string;
  comments: Schema<"SimpleWorkoutCommentResponseDTO">[];
  onRequireLazyLoad: () => void;
  onRequireClose: () => void;
  onAddNewComment: (
    newComment: Schema<"CreateWorkoutCommentRequestDTO">
  ) => void;
};

export default function WorkoutCommentSection({
  workoutId,
  comments,
  onRequireLazyLoad,
  onRequireClose,
  onAddNewComment,
}: WorkoutCommentSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollableWrapperRef = useRef<HTMLDivElement>(null);

  useScrollTrigger(scrollableWrapperRef, 0.7, onRequireLazyLoad);
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

    onAddNewComment(newComment);
  }

  const [replies, setReplies] = useState<
    Promise<Schema<"SimpleWorkoutCommentResponseDTO">[]>[]
  >([]);

  return (
    <Motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 300,
        },
        enter: {
          opacity: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          y: 300,
        },
      }}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{
        duration: 0.3,
        type: "just",
      }}
      className="workout-display-comment-section"
      ref={wrapperRef}
    >
      <div
        className="comment-section-wrapper"
        id="comment-section-wrapper"
        ref={scrollableWrapperRef}
      >
        <CommentInputField type="comment" onSubmit={handleCreateComment} />

        <div className="workout-comments-body">
          {comments.map((comment, i) => (
            <WorkoutComment
              key={comment.id}
              comment={comment}
              replies={replies[i]}
              updateReplies={(replies) =>
                setReplies((prev) => {
                  prev[i] = replies;
                  return prev;
                })
              }
            />
          ))}
        </div>
      </div>
    </Motion.div>
  );
}
