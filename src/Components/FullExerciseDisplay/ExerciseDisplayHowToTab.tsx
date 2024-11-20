import { Schema } from "../../Types/Endpoints/SchemaParser";

type ExerciseDisplayHowToTabProps = {
  exercise: Schema<"DetailedExerciseResponseDTO">;
};

export default function ExerciseDisplayHowToTab({}: ExerciseDisplayHowToTabProps) {
  return <div>ExerciseDisplayHowToTab</div>;
}
