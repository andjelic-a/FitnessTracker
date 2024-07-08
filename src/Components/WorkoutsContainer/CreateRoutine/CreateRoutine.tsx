import React, { useRef, useEffect, useState } from "react";
import RoutineItem from "./RoutineItem/RoutineItem";
import ChooseExercise from "./ChooseExercise/ChooseExercise";
import "./CreateRoutine.scss";
import { v4 as uuidv4 } from "uuid";

interface CreateRoutineProps {
  isNewWindowOpen: boolean;
  setIsNewWindowOpen: (isOpen: boolean) => void;
}

export default function CreateRoutine({
  isNewWindowOpen,
  setIsNewWindowOpen,
}: CreateRoutineProps) {
  const [routineItems, setRoutineItems] = useState<
    { id: string; element: JSX.Element; exercise: string }[]
  >([]);
  const [routineTitle, setRoutineTitle] = useState<string>("");
  const [isChooseExerciseOpen, setIsChooseExerciseOpen] =
    useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(
    null
  );

  const excludedDivRef = useRef<HTMLDivElement | null>(null);
  const routineTitleRef = useRef<HTMLInputElement | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        excludedDivRef.current &&
        !excludedDivRef.current.contains(event.target as Node)
      ) {
        setIsNewWindowOpen(false);
        if (routineTitleRef.current) {
          routineTitleRef.current.value = "";
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsNewWindowOpen]);

  const handleDeleteExercise = (id: string) => {
    setRoutineItems((prevState) => prevState.filter((item) => item.id !== id));
  };

  const handleAddNewExerciseClick = () => {
    setIsChooseExerciseOpen(true);

    if (excludedDivRef.current) {
      excludedDivRef.current.scrollTo({
        top: 0,
      });
    }
  };

  const handleAddExercise = (exercises: string[]) => {
    const newItems = exercises.map((exercise) => {
      const id = uuidv4();
      return {
        id,
        exercise,
        element: (
          <RoutineItem
            key={id}
            exercise={exercise}
            onDelete={() => handleDeleteExercise(id)}
            onReplace={() => handleReplaceExercise(id)}
            id={id}
          />
        ),
      };
    });
    setRoutineItems((prevState) => [...prevState, ...newItems]);
  };

  const handleReplaceExercise = (id: string) => {
    setIsChooseExerciseOpen(true);
    setReplacingExerciseId(id);
  };

  const handleExerciseChosen = (exercises: string[]) => {
    if (replacingExerciseId) {
      const updatedItems = routineItems.map((item) => {
        if (item.id === replacingExerciseId) {
          return {
            ...item,
            exercise: exercises[0],
            element: (
              <RoutineItem
                key={item.id}
                exercise={exercises[0]}
                onDelete={() => handleDeleteExercise(item.id)}
                onReplace={() => handleReplaceExercise(item.id)}
                id={item.id}
              />
            ),
          };
        }
        return item;
      });
      setRoutineItems(updatedItems);
      setReplacingExerciseId(null);
      setIsChooseExerciseOpen(false);
    } else {
      handleAddExercise(exercises);
    }
  };

  const handleSaveClick = () => {
    setRoutineItems([]);
    setRoutineTitle("");
    setIsNewWindowOpen(false);
    setIsChooseExerciseOpen(false);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoutineTitle(event.target.value);
  };

  return (
    <div
      ref={excludedDivRef}
      className={`create-routine-window ${
        isNewWindowOpen ? "create-routine-window-open" : ""
      } ${isChooseExerciseOpen ? "no-scroll" : ""}`}
    >
      {isChooseExerciseOpen && (
        <ChooseExercise
          onClose={() => setIsChooseExerciseOpen(false)}
          onAddExercise={handleExerciseChosen}
          isReplaceMode={!!replacingExerciseId}
        />
      )}
      <div className="create-routine-header" ref={topRef}>
        <input
          ref={routineTitleRef}
          type="text"
          id="routine-title"
          placeholder="Routine title"
          maxLength={25}
          value={routineTitle}
          onChange={handleChangeTitle}
        />
        <button onClick={handleSaveClick} className="create-routine-save">
          Save
        </button>
      </div>
      <div className="create-routine-body">
        {routineItems.map((item) => item.element)}
        <button
          onClick={handleAddNewExerciseClick}
          className="create-routine-add-exercise"
        >
          Add exercise
        </button>
      </div>
    </div>
  );
}