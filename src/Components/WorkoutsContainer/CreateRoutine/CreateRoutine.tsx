import { useRef, useEffect, useState } from "react";
import RoutineItem from "./RoutineItem/RoutineItem";
import "./CreateRoutine.scss";

interface CreateRoutineProps {
  isNewWindowOpen: boolean;
  setIsNewWindowOpen: (isOpen: boolean) => void;
}

export default function CreateRoutine({
  isNewWindowOpen,
  setIsNewWindowOpen,
}: CreateRoutineProps) {
  const [numOfExercises, setNumOfExercises] = useState<number>(0);
  const [routineItems, setRoutineItems] = useState<JSX.Element[]>([]);
  const [routineTitle, setRoutineTitle] = useState<string>("");

  const excludedDivRef = useRef<HTMLDivElement | null>(null);
  const routineTitleRef = useRef<HTMLInputElement | null>(null);

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

  const handleAddNewExerciseClick = () => {
    setRoutineItems((prevState) => [...prevState, <RoutineItem key={numOfExercises} />]);
    setNumOfExercises((prevState) => prevState + 1);
  };

  const handleSaveClick = () => {
    setRoutineItems([]);
    setNumOfExercises(0);
    setRoutineTitle("");
    setIsNewWindowOpen(false);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoutineTitle(event.target.value);
  };

  return (
    <div
      ref={excludedDivRef}
      className={`create-routine-window ${
        isNewWindowOpen ? "create-routine-window-open" : ""
      }`}
    >
      <div className="create-routine-header">
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
        {routineItems}
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