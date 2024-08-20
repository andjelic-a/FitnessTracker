import "./WorkoutItem.scss";
import Icon from "../../Icon/Icon.tsx";
import { WorkoutItemData } from "./WorkoutItem.tsx";

type StaticWorkoutItemProps = {
  workoutItem: WorkoutItemData;
};

export default function StaticWorkoutItem({
  workoutItem,
}: StaticWorkoutItemProps) {
  return (
    <div
      id={`workout-item-${workoutItem.id}`}
      className="workout-item"
      aria-hidden
    >
      <div className="workout-item-header">
        <div className="exercise">
          <img
            src={workoutItem.exercise.image}
            alt={`Image of an exercise: ${workoutItem.exercise.name}`}
            className="exercise-image"
          />

          <button className="exercise-name">{workoutItem.exercise.name}</button>

          <button className="collapse-btn">
            <Icon name="chevron-up" />
          </button>
        </div>

        <button className="drag-handle">
          <Icon name="grip-vertical" />
        </button>
      </div>
    </div>
  );
}
