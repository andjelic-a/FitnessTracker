import { Schema } from "../../../Types/Endpoints/SchemaParser";
import "./RoutineDisplayItem.scss";

type Set = Schema<"DetailedSetResponseDTO">;

interface RoutineDisplayItemProps {
  name: string;
  sets: Set[];
}

export default function RoutineDisplayItem({ name, sets }: RoutineDisplayItemProps) {
  return (
    <div className="routine-display-item">
      <h3>{name}</h3>
      <ul>
        {sets.map((set) => (
          <li key={set.id}>
            Reps: {set.repsCompletedLastTime}, Weight: {set.weightUsedLastTime}, RIR: {set.riR}
          </li>
        ))}
      </ul>
    </div>
  );
}
