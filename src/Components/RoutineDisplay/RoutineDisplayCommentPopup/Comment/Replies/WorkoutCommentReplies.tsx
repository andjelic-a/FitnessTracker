import { Schema } from "../../../../../Types/Endpoints/SchemaParser";
import WorkoutComment from "../WorkoutComment";

type WorkoutCommentRepliesProps = {
  replies: Schema<"SimpleWorkoutCommentResponseDTO">[];
};

export default function WorkoutCommentReplies({
  replies,
}: WorkoutCommentRepliesProps) {
  return (
    <div className="workout-comment-reply-container">
      {replies.map((reply) => (
        <WorkoutComment isReply key={reply.id} comment={reply} />
      ))}
    </div>
  );
}
