import { Suspense, useState } from "react";
import Icon from "../../../Icon/Icon";
import "./ChooseExercise.scss";
import { Await } from "react-router-dom";
import sendAPIRequest from "../../../../Data/SendAPIRequest";
import { APIResponse } from "../../../../Types/Endpoints/ResponseParser";

type ChooseExerciseProps = {
  onClose: () => void;
  onAddExercise: (exercises: string[]) => void;
  isReplaceMode: boolean;

  preLoadedExercises: APIResponse<"/api/exercise", "get"> | null;
  onLoadExercises: (exercises: APIResponse<"/api/exercise", "get">) => void;
};

export default function ChooseExercise({
  onClose,
  onAddExercise,
  isReplaceMode,
  onLoadExercises,
  preLoadedExercises,
}: ChooseExerciseProps) {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleConfirm = () => {
    if (selectedExercises.length > 0) {
      onAddExercise(selectedExercises);
      onClose();
    }
  };

  const handleSelectExercise = (exercise: string) => {
    setSelectedExercises((prevSelectedExercises) => {
      if (isReplaceMode) {
        return [exercise];
      } else {
        if (prevSelectedExercises.includes(exercise)) {
          return prevSelectedExercises.filter((e) => e !== exercise);
        } else {
          return [...prevSelectedExercises, exercise];
        }
      }
    });
  };

  async function getExercises(): Promise<APIResponse<"/api/exercise", "get">> {
    let exercises: APIResponse<"/api/exercise", "get"> | null =
      preLoadedExercises;

    if (exercises) return exercises;
    console.log("loading");

    exercises = await sendAPIRequest("/api/exercise", {
      method: "get",
      parameters: { limit: 10 },
    });

    onLoadExercises(exercises);
    return exercises;
  }

  return (
    <div className="choose-exercise">
      <div className="choose-exercise-header">
        <h3>Choose Exercise</h3>
      </div>
      <div className="choose-exercise-body">
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={getExercises()}>
            {(exercises: APIResponse<"/api/exercise", "get">) => {
              {
                if (exercises.code !== "OK") return null;
                return (
                  <>
                    {exercises.content.map((exercise) => (
                      <ExerciseOption
                        key={exercise.id}
                        exercise={exercise.name}
                        onSelectExercise={handleSelectExercise}
                        isSelected={selectedExercises.includes(exercise.name)}
                        image={exercise.image}
                      />
                    ))}
                  </>
                );
              }
            }}
          </Await>
        </Suspense>
      </div>
      <div className="choose-exercise-footer">
        <button className="choose-exercise-button" onClick={handleConfirm}>
          {isReplaceMode ? "Replace" : "Add"}
        </button>
        <button className="choose-exercise-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

interface ExerciseOptionProps {
  exercise: string;
  onSelectExercise: (exercise: string) => void;
  isSelected: boolean;
  image: string | null;
}

function ExerciseOption({
  exercise,
  onSelectExercise,
  isSelected,
  image,
}: ExerciseOptionProps) {
  const handleClick = () => {
    onSelectExercise(exercise);
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
      <img src={image ?? "/DefaultProfilePicture.png"} alt="Exercise" />
      <h3>{exercise}</h3>
    </div>
  );
}
