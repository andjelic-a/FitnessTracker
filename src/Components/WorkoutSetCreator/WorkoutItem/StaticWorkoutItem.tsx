import "./WorkoutItem.scss";
import Icon from "../../Icon/Icon.tsx";
import { WorkoutItemData } from "./WorkoutItem.tsx";
import StaticWorkoutSetDisplay from "./StaticWorkoutSetDisplay.tsx";

type StaticWorkoutItemProps = {
  workoutItem: WorkoutItemData;
};

export default function StaticWorkoutItem({
  workoutItem,
}: StaticWorkoutItemProps) {
  return (
    <div className="workout-item" aria-hidden tabIndex={-1}>
      <div className="workout-item-header">
        <div className="exercise">
          <img
            src={workoutItem.exercise.image}
            alt={`Image of an exercise: ${workoutItem.exercise.name}`}
            className="exercise-image"
          />

          <button className="exercise-name">{workoutItem.exercise.name}</button>
        </div>

        <div className="drag-handle">
          <Icon name="grip-vertical" />
        </div>
      </div>

      <div className="workout-item-body">
        <div className="exercise-set">
          <div className="set-information-header-container">
            <p hidden></p>
            <p>SET</p>
            <p>RiR</p>
            <p>VOLUME</p>
          </div>

          {workoutItem.sets.map((set, index) => (
            <StaticWorkoutSetDisplay key={set.id} set={set} index={index} />
          ))}

          <button className="add-set-btn">
            <Icon className="add-set-icon" name="plus" />
          </button>
        </div>
      </div>
    </div>
  );
}
