import "./WorkoutItem.scss";
import Icon from "../../Icon/Icon.tsx";
import WorkoutSetDisplay from "./WorkoutSetDisplay.tsx";
import { WorkoutItemData } from "./WorkoutItem.tsx";

type StaticWorkoutItemProps = {
  workoutItem: WorkoutItemData;
};

export default function StaticWorkoutItem({
  workoutItem,
}: StaticWorkoutItemProps) {
  return (
    <div id={`workout-item-${workoutItem.id}`} className="workout-item">
      <div className="workout-item-header">
        <div className="exercise">
          <img src={workoutItem.exercise.image} />

          <button>{workoutItem.exercise.name}</button>
        </div>

        <div className="drag-handle">
          <Icon name="grip-vertical" />
        </div>
      </div>

      <div className="workout-item-body">
        <div className="exercise-set">
          <div className="exercise-set-placeholder">
            <p>SET</p>
            <p>RiR</p>
            <p>VOLUME</p>
          </div>
          {workoutItem.sets.map((set, index) => (
            <WorkoutSetDisplay
              key={set.id}
              set={set}
              index={index}
              itemId={workoutItem.id}
            />
          ))}
          <div className="icon-wrapper">
            <Icon className="add-set-icon" name="plus" />
          </div>
        </div>
      </div>
    </div>
  );
}
