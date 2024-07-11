import "./ChooseExercise.scss";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import Icon from "../../../Icon/Icon";

type ExerciseOptionProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  onSelectExercise: (exercise: Schema<"SimpleExerciseResponseDTO">) => void;
  isSelected: boolean;
};

export function ExerciseOption({
  exercise,
  onSelectExercise,
  isSelected,
}: ExerciseOptionProps) {
  const handleClick = () => void onSelectExercise(exercise);

  const handleImageScaleUp = (image: HTMLImageElement) =>
    void image.classList.add("big");

  const handleImageScaleDown = (image: HTMLImageElement) =>
    void image.classList.remove("big");

  const handleImageScaleToggle = (image: HTMLImageElement) =>
    void image.classList.toggle("big");

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
      <img
        src={exercise.image}
        alt="Exercise"
        onMouseOver={(e) => handleImageScaleUp(e.target as HTMLImageElement)}
        onMouseLeave={(e) => handleImageScaleDown(e.target as HTMLImageElement)}
        onClick={(e) => handleImageScaleToggle(e.target as HTMLImageElement)}
      />
      <h3>{exercise.name}</h3>
    </div>
  );
}
