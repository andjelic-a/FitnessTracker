import "./WorkoutCommentSection.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { memo, useMemo, useRef, useState } from "react";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import WorkoutComment from "./Comment/WorkoutComment";
import CommentInputField from "./CommentInputField/CommentInputField";
import { motion as Motion } from "framer-motion";
import { getProfileCache } from "../../../Pages/Profile/ProfileCache";
import LazyLoadingContainer, {
  OnlyGet,
} from "../../LazyLoadingContainer/LazyLoadingContainer";
import { Request } from "../../../Types/Endpoints/RequestParser";

type WorkoutCommentSectionProps = {
  workoutId: string;
  onRequireClose: () => void;
  onCreateNewComment: () => void;
};

const WorkoutCommentSection = memo<WorkoutCommentSectionProps>(
  ({ workoutId, onRequireClose, onCreateNewComment }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollableWrapperRef = useRef<HTMLDivElement>(null);
    const commentInputFieldRef = useRef<HTMLTextAreaElement>(null);

    useOutsideClick(wrapperRef, onRequireClose);

    const [newComments, setNewComments] = useState<
      Schema<"SimpleWorkoutCommentResponseDTO">[]
    >([]);

    async function handleCreateComment(
      newComment: Schema<"CreateWorkoutCommentRequestDTO">
    ) {
      const response = await sendAPIRequest(
        "/api/workout/{workoutId}/comment",
        {
          method: "post",
          parameters: {
            workoutId,
          },
          payload: newComment,
        }
      );

      if (response.code !== "Created") return;

      const userData = getProfileCache();
      if (!userData) return;

      const user = await userData.user;
      if (user.code !== "OK") return;

      onCreateNewComment();

      const newCommentSimulatedResponse: Schema<"SimpleWorkoutCommentResponseDTO"> =
        {
          id: response.content,
          createdAt: new Date().toISOString(),
          creator: user.content,
          isCreator: true,
          isLiked: false,
          likeCount: 0,
          replyCount: 0,
          text: newComment.comment,
          workoutId,
        };

      setNewComments((prev) => [newCommentSimulatedResponse, ...prev]);
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

    const baseRequest = useMemo<
      OnlyGet<Request<"/api/workout/{workoutId}/comment">>
    >(
      () => ({
        method: "get",
        parameters: {
          workoutId,
          limit: 10,
          offset: 0,
        },
      }),
      [workoutId]
    );

    const commentElements = useMemo(
      () => (
        <LazyLoadingContainer
          before={
            newComments.length === 0 ? undefined : (
              <>
                {newComments.map((comment) => (
                  <WorkoutComment
                    onCreateNewReply={onCreateNewComment}
                    key={comment.id}
                    comment={comment}
                    workoutId={workoutId}
                  />
                ))}
              </>
            )
          }
          endpoint="/api/workout/{workoutId}/comment"
          baseAPIRequest={baseRequest}
          onSegmentLoad={(comments) => {
            if (comments.code !== "OK" || comments.content.length === 0)
              return <p className="empty">Nothing to see here...</p>;

            return (
              <>
                {comments.content.map((x) => (
                  <WorkoutComment
                    key={x.id}
                    onCreateNewReply={onCreateNewComment}
                    comment={x}
                    workoutId={workoutId}
                  />
                ))}
              </>
            );
          }}
          stopCondition={(response) =>
            response.code === "Unauthorized" ||
            response.code === "Forbidden" ||
            (response.code === "OK" && response.content.length < 10)
          }
        />
      ),
      [newComments]
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
            {/* <AnimatePresence>{commentElements}</AnimatePresence> */}
            {commentElements}
          </div>
        </div>
      </Motion.div>
    );
  }
);

export default WorkoutCommentSection;
