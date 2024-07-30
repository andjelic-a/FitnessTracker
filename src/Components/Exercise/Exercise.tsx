import Icon from "../Icon/Icon";
import "./Exercise.scss";

type ExerciseProps = {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
};

export default function Exercise({ setIsOpen, isOpen }: ExerciseProps) {
  return (
    <div className={`exercise ${isOpen ? "exercise-open" : ""}`}>
      <div className="exercise-header">
        <h3>Exercise</h3>
        <Icon
          onClick={() => setIsOpen(false)}
          className="exercise-header-exit"
          name="xmark"
        />
      </div>
    </div>
  );
}
