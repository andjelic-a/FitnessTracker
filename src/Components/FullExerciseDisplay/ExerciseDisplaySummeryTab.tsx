import { Schema } from "../../Types/Endpoints/SchemaParser";
import FormattedText from "../FormattedText/FormattedText";

type ExerciseDisplaySummeryTabProps = {
  exercise: Schema<"DetailedExerciseResponseDTO">;
};

export default function ExerciseDisplaySummeryTab({
  exercise,
}: ExerciseDisplaySummeryTabProps) {
  return (
    <>
      <div className="full-exercise-display-info">
        <h1>{exercise.name}</h1>
        <div className="full-exercise-display-info-description">
          <FormattedText children={exercise.description} />
        </div>

        <h2>Primary Muscles</h2>
        <ul>
          {exercise.primaryMuscleGroups.map((muscleGroup) => (
            <li key={muscleGroup.id}>
              <h3>{muscleGroup.name}</h3>
              {exercise.primaryMuscles
                .filter((muscle) => muscle.muscleGroupId === muscleGroup.id)
                .map((muscle) => (
                  <p key={muscle.id}>{muscle.name}</p>
                ))}
            </li>
          ))}
        </ul>

        {exercise.secondaryMuscleGroups.length > 0 && (
          <>
            <h2>Secondary Muscles</h2>
            <ul>
              {exercise.secondaryMuscleGroups.map((muscleGroup) => (
                <li key={muscleGroup.id}>
                  <h3>{muscleGroup.name}</h3>
                  {exercise.secondaryMuscles
                    .filter((muscle) => muscle.muscleGroupId === muscleGroup.id)
                    .map((muscle) => (
                      <p key={muscle.id}>{muscle.name}</p>
                    ))}
                </li>
              ))}
            </ul>
          </>
        )}

        <h2>Equipment</h2>
        <ul>
          {exercise.equipment.map((equipment) => (
            <li key={equipment.id}>{equipment.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
