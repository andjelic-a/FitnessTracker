import { Schema } from "../../Types/Endpoints/SchemaParser";

type ExerciseDisplayHistoryTabProps = {
  exercise: Schema<"DetailedExerciseResponseDTO">;
};

export default function ExerciseDisplayHistoryTab({}: ExerciseDisplayHistoryTabProps) {
  return <div>ExerciseDisplayHistoryTab</div>;
}
