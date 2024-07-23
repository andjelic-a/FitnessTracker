import { Schema } from "../../../../../Types/Endpoints/SchemaParser";
import WorkoutComment from "../WorkoutComment";

type WorkoutCommentRepliesProps = {
  parentId: string;
  replies: Schema<"SimpleWorkoutCommentResponseDTO">[];
};

export default function WorkoutCommentReplies({
  parentId,
  replies,
}: WorkoutCommentRepliesProps) {
  return (
    <div className="workout-comment-reply-container">
      {replies.map((reply) => (
        <WorkoutComment
          parentId={parentId}
          isReply
          key={reply.id}
          comment={reply}
        />
      ))}
    </div>
  );
}
