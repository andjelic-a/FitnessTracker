import "./WorkoutCommentSection.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { memo, useMemo, useRef, useState } from "react";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import Comment from "./Comment/WorkoutComment";
import CommentInputField from "./CommentInputField/CommentInputField";
import { getProfileCache } from "../../../Pages/Profile/ProfileCache";
import LazyLoadingContainer, {
  OnlyGet,
} from "../../LazyLoadingContainer/LazyLoadingContainer";
import { Request } from "../../../Types/Endpoints/RequestParser";

type CommentSectionProps = {
  id: string;
  type: "workout" | "split";
  onRequireClose: () => void;
  onCreateNewComment: () => void;
};

type CommentSchema =
  | Schema<"SimpleWorkoutCommentResponseDTO">
  | Schema<"SimpleSplitCommentResponseDTO">;

const CommentSection = memo<CommentSectionProps>(
  ({ id, type, onRequireClose, onCreateNewComment }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollableWrapperRef = useRef<HTMLDivElement>(null);
    const commentInputFieldRef = useRef<HTMLTextAreaElement>(null);

    useOutsideClick(wrapperRef, onRequireClose);

    const [newComments, setNewComments] = useState<CommentSchema[]>([]);

    async function handleCreateComment(
      newComment: Schema<"CreateWorkoutCommentRequestDTO">
    ) {
      const response = await sendAPIRequest(
        type === "workout"
          ? "/api/workout/{workoutId}/comment"
          : "/api/split/{splitId}/comment",
        {
          method: "post",
          parameters: {
            workoutId: id,
            splitId: id,
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

      const newCommentSimulatedResponse: CommentSchema = {
        id: response.content.newCommentId,
        createdAt: new Date().toISOString(),
        creator: user.content,
        isCreator: true,
        isLiked: false,
        likeCount: 0,
        replyCount: 0,
        text: newComment.comment,
        workoutId: id,
        splitId: id,
      };

      setNewComments((prev) => [newCommentSimulatedResponse, ...prev]);
    }

    const baseRequest = useMemo<
      OnlyGet<
        | Request<"/api/workout/{workoutId}/comment">
        | Request<"/api/split/{splitId}/comment">
      >
    >(
      () => ({
        method: "get",
        parameters: {
          workoutId: id,
          splitId: id,
          limit: 10,
          offset: 0,
        },
      }),
      [id]
    );

    const commentElements = useMemo(
      () => (
        <LazyLoadingContainer
          before={
            newComments.length === 0 ? undefined : (
              <>
                {newComments.map((comment) => (
                  <Comment
                    key={comment.id}
                    type={type}
                    onCreateNewReply={onCreateNewComment}
                    comment={comment}
                    workoutId={id}
                  />
                ))}
              </>
            )
          }
          endpoint={
            type === "workout"
              ? "/api/workout/{workoutId}/comment"
              : "/api/split/{splitId}/comment"
          }
          baseAPIRequest={baseRequest}
          onSegmentLoad={(comments, segmentIndex) => {
            if (comments.code !== "OK" || comments.content.length === 0) {
              if (segmentIndex === 0)
                return <p className="empty">Nothing to see here...</p>;
              else return <></>;
            }

            return (
              <>
                {comments.content.map((x) => (
                  <Comment
                    key={x.id}
                    type={type}
                    onCreateNewReply={onCreateNewComment}
                    comment={x}
                    workoutId={id}
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
      <div className="workout-display-comment-section" ref={wrapperRef}>
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
      </div>
    );
  }
);

export default CommentSection;
