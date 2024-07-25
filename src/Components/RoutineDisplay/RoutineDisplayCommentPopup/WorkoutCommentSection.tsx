import "./WorkoutCommentSection.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { useMemo, useRef } from "react";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import WorkoutComment from "./Comment/WorkoutComment";
import CommentInputField from "./CommentInputField/CommentInputField";
import useScrollTrigger from "../../../Hooks/UseScrollTrigger";
import { AnimatePresence, motion as Motion } from "framer-motion";

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
  const commentInputFieldRef = useRef<HTMLTextAreaElement>(null);

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

  const motionProps = useMemo(
    () => ({
      variants: {
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
      },
      initial: "hidden",
      animate: "enter",
      exit: "exit",
      transition: {
        duration: 0.3,
        type: "just",
      },
    }),
    []
  );

  const commentELements = useMemo(
    () => (
      <>
        {comments.map((comment) => (
          <WorkoutComment
            key={comment.id}
            comment={comment}
            workoutId={workoutId}
          />
        ))}
      </>
    ),
    [comments]
  );

  return (
    <Motion.div
      {...motionProps}
      className="workout-display-comment-section"
      ref={wrapperRef}
    >
      <div
        className="comment-section-wrapper"
        id="comment-section-wrapper"
        ref={scrollableWrapperRef}
      >
        <CommentInputField
          textAreaRef={commentInputFieldRef}
          type="comment"
          onSubmit={handleCreateComment}
        />

        <div className="workout-comments-body">
          <AnimatePresence>{commentELements}</AnimatePresence>
        </div>
      </div>
    </Motion.div>
  );
}
