import { Schema } from "../../Types/Endpoints/SchemaParser";
import Async from "../Async/Async";
import { ExerciseSelectorOption } from "./ExerciseSelectorOption";

type ExerciseSelectorSegmentProps = {
  exercises: Promise<Schema<"SimpleExerciseResponseDTO">[]>;
  selectedExercises:
    | Schema<"SimpleExerciseResponseDTO">
    | Schema<"SimpleExerciseResponseDTO">[];
  onSelectExercise: (exercise: Schema<"SimpleExerciseResponseDTO">) => void;
};

export default function ExerciseSelectorSegment({
  exercises,
  selectedExercises,
  onSelectExercise,
}: ExerciseSelectorSegmentProps) {
  return (
    <Async await={exercises}>
      {(exercises) =>
        exercises.map((exercise) => (
          <ExerciseSelectorOption
            key={exercise.id}
            exercise={exercise}
            isSelected={
              Array.isArray(selectedExercises)
                ? selectedExercises.includes(exercise)
                : selectedExercises.id === exercise.id
            }
            onSelectExercise={onSelectExercise}
          />
        ))
      }
    </Async>
  );
}
