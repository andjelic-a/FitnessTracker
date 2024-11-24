import { memo, useContext, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import "./CommentSection.scss";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { Request } from "../../Types/Endpoints/RequestParser";
import LazyLoadingContainer, {
  OnlyGet,
} from "../LazyLoadingContainer/LazyLoadingContainer";
import Comment from "./Comment/Comment";
import CommentInputField from "./CommentInputField/CommentInputField";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

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
    const basicInfo = useContext(basicProfileInfoContext);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollableWrapperRef = useRef<HTMLDivElement>(null);
    const commentInputFieldRef = useRef<HTMLTextAreaElement>(null);

    useOutsideClick(wrapperRef, onRequireClose);

    const [newComments, setNewComments] = useState<CommentSchema[]>([]);

    function getRequestParameters():
      | {
          workoutId: string;
        }
      | {
          splitId: string;
        } {
      if (type === "workout") return { workoutId: id };
      else return { splitId: id };
    }

    async function handleCreateComment(
      newComment: Schema<"CreateWorkoutCommentRequestDTO">
    ) {
      if (!basicInfo) return;

      const response = await sendAPIRequest(
        type === "workout"
          ? "/api/workout/{workoutId}/comment"
          : "/api/split/{splitId}/comment",
        {
          method: "post",
          parameters: getRequestParameters(),
          payload: newComment,
        }
      );

      if (response.code !== "Created") return;

      onCreateNewComment();

      const newCommentSimulatedResponse: CommentSchema = {
        id: response.content.newCommentId,
        createdAt: new Date().toISOString(),
        creator: basicInfo,
        isCreator: true,
        isLiked: false,
        likeCount: 0,
        replyCount: 0,
        text: newComment.comment,
        ...getRequestParameters(),
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
          ...getRequestParameters(),
          limit: 10,
          offset: 0,
        } as any,
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
                    id={id}
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
                    id={id}
                  />
                ))}
              </>
            );
          }}
          stopCondition={(response) =>
            response.code === "OK" && response.content.length < 10
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

          <div className="workout-comments-body">{commentElements}</div>
        </div>
      </div>
    );
  }
);

export default CommentSection;
