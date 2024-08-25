import "./WorkoutDisplayItem.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import Icon from "../../Icon/Icon";
import { SetType } from "../../WorkoutSetCreator/WorkoutItem/WorkoutItem";

type WorkoutDisplayItemProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  sets: Schema<"DetailedSetResponseDTO">[];
};

export default function WorkoutDisplayItem({
  sets,
  exercise,
}: WorkoutDisplayItemProps) {
  function getIconByType(typeIdx: number, index: number) {
    const type: SetType = ["1", "w", "d", "f"][typeIdx] as SetType;

    if (type === "1") return <p className="set-icon">{index + 1}</p>;
    else return <Icon className="set-icon" name={type} />;
  }

  return (
    <div className="workout-display-item">
      <div className="workout-display-item-header">
        <div className="image-container">
          <img src={exercise.image} />
        </div>

        <p>{exercise.name}</p>
      </div>

      <div className="workout-display-item-body">
        <div className="set-information-header-container set">
          <p>SET</p>
          <p>RiR</p>
          <p>VOLUME</p>
        </div>

        {sets.map((set, index) => (
          <div className="set" key={set.id}>
            <div>{getIconByType(set.type, index)}</div>

            <div>
              <p>{set.riR}</p>
            </div>

            <div>
              <p>{`${set.bottomRepRange}-${set.topRepRange}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
