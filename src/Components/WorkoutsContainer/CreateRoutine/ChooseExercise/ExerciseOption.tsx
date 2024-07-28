import "./ChooseExercise.scss";
import { useState } from "react";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import Icon from "../../../Icon/Icon";

type ExerciseOptionProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  onSelectExercise: (exercise: Schema<"SimpleExerciseResponseDTO">) => void;
  isSelected: boolean;
  handleLinkClick: (isLinkClicked: boolean) => void;
};

export function ExerciseOption({
  exercise,
  onSelectExercise,
  isSelected,
  handleLinkClick,
}: ExerciseOptionProps) {
  const [isLinkHovered, setIsLinkHovered] = useState<boolean>(false);

  const handleClick = () => void onSelectExercise(exercise);

  const handleScaleUp = (element: HTMLImageElement | HTMLDivElement) =>
    void element.classList.add("big");

  const handleScaleDown = (element: HTMLImageElement | HTMLDivElement) =>
    void element.classList.remove("big");

  const handleLinkContainerClick = () => {
    setIsLinkHovered(false);
    handleLinkClick(true);
  };

  return (
    <div
      className={"exercise-option " + (isSelected ? "selected" : "")}
      onClick={handleClick}
    >
      <div className="select-circle-container">
        <div>
          {isSelected && <Icon className="select-circle-check" name="check" />}
        </div>
      </div>
      <div
        className="image-container"
        onMouseOver={(e) => handleScaleUp(e.currentTarget)}
        onMouseLeave={(e) => handleScaleDown(e.currentTarget)}
        onClick={(e) => handleScaleDown(e.currentTarget)}
      >
        <img src={exercise.image} alt="Exercise" />
      </div>
      <h3>{exercise.name}</h3>
      <div
        onMouseEnter={() => setIsLinkHovered(true)}
        onMouseLeave={() => setIsLinkHovered(false)}
        onClick={() => handleLinkContainerClick()}
        className="choose-exercise-link-container"
      >
        <Icon name="link" />
        <div
          className={`choose-exercise-link-popup ${
            isLinkHovered ? "show" : ""
          }`}
        >
          <p>link</p>
        </div>
      </div>
    </div>
  );
}
