import "./WorkoutCommentSection.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { useEffect, useRef, useState } from "react";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import WorkoutComment from "./Comment/WorkoutComment";
import CommentInputField from "./CommentInputField/CommentInputField";
import useScrollTrigger from "../../../Hooks/UseScrollTrigger";
import { motion as Motion } from "framer-motion";
import { getProfileCache } from "../../../Pages/Profile/ProfileCache";
import { v4 } from "uuid";

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

  useEffect(() => {
    setReplies((prev) => {
      for (let i = 0; i < comments.length; i++) {
        if (prev[i]) continue;

        prev[i] = null;
      }

      return prev.slice();
    });
  }, [comments]);

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
    (Promise<Schema<"SimpleWorkoutCommentResponseDTO">[]> | null)[]
  >([]);

  async function getInitialReplies(i: number) {
    if (replies[i]) return await replies[i];

    const data = sendAPIRequest(
      "/api/workout/{workoutId}/comment/{commentId}/reply",
      {
        method: "get",
        parameters: {
          commentId: comments[i].id,
          workoutId: workoutId,
          limit: 10,
          offset: 0,
        },
      }
    ).then((data) => {
      if (data.code !== "OK") return [];

      // currentRepliesPromiseRef.current = null;
      return data.content;
    });

    setReplies((prev) => {
      prev[i] = data;
      return prev.slice();
    });
    return data;
  }

  function handleNewReply(
    i: number,
    newReply: Schema<"CreateWorkoutCommentRequestDTO">
  ) {
    const userData = getProfileCache();
    if (!userData) return;

    userData.user.then((user) => {
      if (user.code !== "OK") return;

      const newCommentSimulatedResponse: Schema<"SimpleWorkoutCommentResponseDTO"> =
        {
          id: v4(),
          createdAt: new Date().toISOString(),
          creator: user.content,
          isCreator: true,
          isLiked: false,
          likeCount: 0,
          replyCount: 0,
          text: newReply.comment,
          workoutId: workoutId,
        };

      setReplies((prev) => {
        prev[i] = prev[i]
          ? prev[i].then((replies) => [...replies, newCommentSimulatedResponse])
          : Promise.resolve([newCommentSimulatedResponse]);

        return prev.slice();
      });
    });
  }

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
              requestReplies={getInitialReplies}
              index={i}
              onReply={handleNewReply}
            />
          ))}
        </div>
      </div>
    </Motion.div>
  );
}
