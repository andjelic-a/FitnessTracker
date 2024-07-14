import { useRef } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import "./RoutineDisplay.scss";
import { useNavigate } from "react-router-dom";

export default function RoutineDisplay() {
  const routineDisplayRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useOutsideClick(routineDisplayRef, () => navigate(".."), "left");

  return (
    <div ref={routineDisplayRef} className={`routine-display visible`}>
      <div className="routine-display-header">
        <p className="routine-display-title">Push</p>
        <button className="routine-display-edit">Edit</button>
      </div>
    </div>
  );
}
