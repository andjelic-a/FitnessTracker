import { Schema } from "../../../Types/Endpoints/SchemaParser";
import Icon from "../../Icon/Icon";
import "./RoutineDisplayItem.scss";

type RoutineDisplayItemProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  sets: Schema<"DetailedSetResponseDTO">[];
};

export default function RoutineDisplayItem({
  sets,
  exercise,
}: RoutineDisplayItemProps) {
  const getIconByType = (type: number, index: number) => {
    switch (type) {
      case 0:
        return index + 1;
      case 1:
        return <Icon className="routine-display-item-icon" name="w" />;
      case 2:
        return <Icon className="routine-display-item-icon" name="d" />;
      case 3:
        return <Icon className="routine-display-item-icon" name="f" />;
    }
  };

  return (
    <div className="routine-display-item">
      <div className="routine-display-item-header">
        <div className="image-container">
          <img src={exercise.image} />
        </div>
        <p>{exercise.name}</p>
      </div>

      <div className="routine-display-item-body"></div>
      <div className="exercise-set">
        <div className="exercise-set-placeholder">
          <p>SET</p>
          <p>KG</p>
          <p>VOLUME</p>
        </div>
        {sets.map((set, index) => (
          <div className="exercise-set-item" key={set.id}>
            <div>{getIconByType(set.type, index)}</div>
            <div>{set.weightUsedLastTime}</div>
            <div>{set.repsCompletedLastTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
