import { useRef } from "react";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import "./RoutineDisplay.scss";

interface RoutineDisplayProps {
  isVisible: boolean;
  onClose: () => void;
  workoutId: string | null;
}

export default function RoutineDisplay({
  isVisible,
  onClose,
  workoutId,
}: RoutineDisplayProps) {
  const routineDisplayRef = useRef<HTMLDivElement>(null);

  useOutsideClick(routineDisplayRef, () => {
    onClose();
  });

  return (
    <div
      ref={routineDisplayRef}
      className={`routine-display ${isVisible ? "visible" : "hidden"}`}
    >
      <div className="routine-display-header">
        <p className="routine-display-title">Push</p>
        <button className="routine-display-edit">Edit</button>
      </div>
    </div>
  );
}
