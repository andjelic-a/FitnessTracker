import { Schema } from "../../../Types/Endpoints/SchemaParser";
import "./RoutineDisplayItem.scss";

type Set = Schema<"DetailedSetResponseDTO">;

interface RoutineDisplayItemProps {
  name: string;
  image: string;
  sets: Set[];
}

export default function RoutineDisplayItem({
  name,
  image,
  sets,
}: RoutineDisplayItemProps) {
  return (
    <div className="routine-display-item">
      <div className="routine-display-item-header">
        <div className="image-container">
          <img src={image} />
        </div>
        <p>{name}</p>
      </div>

      <div className="routine-display-item-body">
        
      </div>
      <ul>
        {sets.map((set) => (
          <li key={set.id}>
            Reps: {set.repsCompletedLastTime}, Weight: {set.weightUsedLastTime},
            RIR: {set.riR}
          </li>
        ))}
      </ul>
    </div>
  );
}
