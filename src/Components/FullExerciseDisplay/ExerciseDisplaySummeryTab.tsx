import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";

type ExerciseDisplaySummeryTabProps = {
  exercise: Schema<"DetailedExerciseResponseDTO">;
};

export default function ExerciseDisplaySummeryTab({
  exercise,
}: ExerciseDisplaySummeryTabProps) {

  const OneRepMaxCalculation = (weight: number, reps: number) => {
    return Math.abs(weight / ((1.0278 - reps * 0.0278)));
  };

  const oneRepMax =
    exercise.mostWeightLifted?.weight && exercise.mostWeightLifted?.reps
      ? OneRepMaxCalculation(
          exercise.mostWeightLifted?.weight,
          exercise.mostWeightLifted?.reps
        )
      : 0;

  return (
    <>
      <div className="full-exercise-display-info">
        <h1>{exercise.name}</h1>

        <div className="full-exercise-display-info-muscle-equipment-section">
          <div className="full-exercise-display-info-muscle-equipment">
            <h3>Primary Muscles:</h3>
            &nbsp;
            <p>
              {exercise.primaryMuscles.length > 0
                ? exercise.primaryMuscles
                    .map((muscle) => muscle.name)
                    .join(", ")
                : "none"}
            </p>
          </div>

          <div className="full-exercise-display-info-muscle-equipment">
            <h3>Secondary Muscles:</h3>
            &nbsp;
            <p>
              {exercise.secondaryMuscles.length > 0
                ? exercise.secondaryMuscles
                    .map((muscle) => muscle.name)
                    .join(", ")
                : "none"}
            </p>
          </div>

          <div className="full-exercise-display-info-muscle-equipment">
            <h3>Equipment:</h3>
            &nbsp;
            <p>
              {exercise.equipment.length > 0
                ? exercise.equipment
                    .map((equipment) => equipment.name)
                    .join(", ")
                : "none"}
            </p>
          </div>
        </div>

        <div className="full-exercise-display-info-personal-records">
          <div className="full-exercise-display-info-personal-records-header">
            <Icon name="award" className="icon" />
            <h3>Personal Records</h3>
          </div>

          <div className="full-exercise-display-info-personal-records-body">
            <div className="full-exercise-display-info-personal-body-record">
              <p>Heaviest Weight</p>
              <p>{exercise.mostWeightLifted?.weight || 0 + "kg"}</p>
            </div>
            <div className="full-exercise-display-info-personal-body-record">
              <p>Best 1RM</p>
              <p>{oneRepMax + "kg"}</p>
            </div>
            <div className="full-exercise-display-info-personal-body-record">
              <p>Best Set Volume</p>
              <p>{(exercise.mostVolumeLifted?.weight || 0) * (exercise.mostVolumeLifted?.reps || 0) + "kg"}</p>
            </div>
            <div className="full-exercise-display-info-personal-body-record">
              <p>Best Session Volume</p>
              <p>{exercise.mostSessionVolumeLifted?.totalVolumeLifted || 0 + "kg"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
