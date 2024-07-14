import "./RoutineDisplay.scss";
import { useRef } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import { useNavigate } from "react-router-dom";
import AnimatedLayout from "../../AnimatedLayout";

export default function RoutineDisplay() {
  const routineDisplayRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useOutsideClick(routineDisplayRef, () => navigate("/me"), "left");

  return (
    <AnimatedLayout>
      <div ref={routineDisplayRef} className={`routine-display visible`}>
        <div className="routine-display-header">
          <p className="routine-display-title">Push</p>
          <button className="routine-display-edit">Edit</button>
        </div>
      </div>
    </AnimatedLayout>
  );
}
