import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";

type ExerciseDisplaySummeryTabProps = {
  exercise: Schema<"DetailedExerciseResponseDTO">;
  unit: "kg" | "lbs";
};

export default function ExerciseDisplaySummeryTab({
  exercise,
  unit,
}: ExerciseDisplaySummeryTabProps) {
  const OneRepMaxCalculation = (weight: number, reps: number) => {
    return Math.abs(weight / (1.0278 - reps * 0.0278));
  };

  const oneRepMax =
    exercise.mostWeightLifted?.weight && exercise.mostWeightLifted?.reps
      ? OneRepMaxCalculation(
          exercise.mostWeightLifted?.weight,
          exercise.mostWeightLifted?.reps
        )
      : 0;

  const convertWeight = (weight: number) => {
    return unit === "lbs" ? weight * 2.20462 : weight * 0.453592;
  };

  return (
    <div className="full-exercise-display-info">
      <h1>{exercise.name}</h1>

      <div className="full-exercise-display-info-muscle-equipment-section">
        <div className="full-exercise-display-info-muscle-equipment">
          <h3>Primary Muscles:</h3>
          <p>
            {exercise.primaryMuscles.length > 0
              ? exercise.primaryMuscles.map((muscle) => muscle.name).join(", ")
              : "none"}
          </p>
        </div>

        <div className="full-exercise-display-info-muscle-equipment">
          <h3>Secondary Muscles:</h3>
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
          <p>
            {exercise.equipment.length > 0
              ? exercise.equipment.map((equipment) => equipment.name).join(", ")
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
            <p>
              {convertWeight(exercise.mostWeightLifted?.weight || 0).toFixed(0)}{" "}
              {unit}
            </p>
          </div>
          <div className="full-exercise-display-info-personal-body-record">
            <p>Best 1RM</p>
            <p>
              {convertWeight(oneRepMax).toFixed(0)} {unit}
            </p>
          </div>
          <div className="full-exercise-display-info-personal-body-record">
            <p>Best Set Volume</p>
            <p>
              {(
                convertWeight(exercise.mostVolumeLifted?.weight || 0) *
                (exercise.mostVolumeLifted?.reps || 0)
              ).toFixed(0)}{" "}
              {unit}
            </p>
          </div>
          <div className="full-exercise-display-info-personal-body-record">
            <p>Best Session Volume</p>
            <p>
              {convertWeight(
                exercise.mostSessionVolumeLifted?.totalVolumeLifted || 0
              ).toFixed(0)}{" "}
              {unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
