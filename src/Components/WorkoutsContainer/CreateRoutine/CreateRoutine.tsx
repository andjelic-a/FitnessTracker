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
    { id: string; element: JSX.Element }[]
  >([]);
  const [routineTitle, setRoutineTitle] = useState<string>("");
  const [isChooseExerciseOpen, setIsChooseExerciseOpen] =
    useState<boolean>(false);

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
        element: (
          <RoutineItem
            key={id}
            exercise={exercise}
            onDelete={() => handleDeleteExercise(id)}
          />
        ),
      };
    });
    setRoutineItems((prevState) => [...prevState, ...newItems]);
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
          onAddExercise={handleAddExercise}
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
