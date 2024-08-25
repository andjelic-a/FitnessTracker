import "./WorkoutDisplayItem.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import WorkoutDisplaySet from "./WorkoutDisplaySet";
import { Link } from "react-router-dom";

type WorkoutDisplayItemProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  sets: Schema<"DetailedSetResponseDTO">[];
};

export default function WorkoutDisplayItem({
  sets,
  exercise,
}: WorkoutDisplayItemProps) {
  return (
    <div className="workout-display-item">
      <div className="workout-display-item-header">
        <div className="image-container">
          <img src={exercise.image} />
        </div>

        <Link className="exercise-name" to={`/exercises/${exercise.id}`}>
          {exercise.name}
        </Link>
      </div>

      <div className="workout-display-item-body">
        <div className="set-information-header-container set">
          <p>SET</p>
          <p>RiR</p>
          <p>VOLUME</p>
        </div>

        {sets.map((set, index) => (
          <WorkoutDisplaySet key={set.id} index={index} set={set} />
        ))}
      </div>
    </div>
  );
}
