import { Schema } from "../../Types/Endpoints/SchemaParser";
import FormattedText from "../FormattedText/FormattedText";

type ExerciseDisplayHowToTabProps = {
  exercise: Schema<"DetailedExerciseResponseDTO">;
};

export default function ExerciseDisplayHowToTab({
  exercise,
}: ExerciseDisplayHowToTabProps) {
  return (
    <div className="full-exercise-display-how-to">
      <h1>{exercise.name}</h1>

      <div className="full-exercise-display-how-to-description">
        <FormattedText children={exercise.description} />
      </div>
    </div>
  );
}
