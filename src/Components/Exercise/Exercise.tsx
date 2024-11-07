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
      <div className="exercise-body">
        <div className="exercise-body-image-container">
          <img src="/DefaultProfilePicture.png" />
        </div>
        <div className="exercise-body-muscles">
          <div>
            <h3>Primary Muscles:</h3>
            <p>Triceps, Front shoulder, Upper chest</p>
          </div>
          <div>
            <h3>Secondary Muscles:</h3>
            <p>Triceps, Front shoulder, Upper chest</p>
          </div>
        </div>
        <div className="exercise-body-description">
          <h3>Description:</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit quae labore ex, blanditiis aut ut porro ullam natus
            minima assumenda accusantium numquam ab, voluptate suscipit soluta
            mollitia quam maxime obcaecati.
          </p>
        </div>
      </div>
    </div>
  );
}
