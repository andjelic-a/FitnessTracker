import { useState, useEffect, useRef } from "react";
import Icon from "../../../Icon/Icon.tsx";
import "./RoutineItem.scss";
import { v4 as uuidv4 } from "uuid";

interface Set {
  id: string;
  set: number | JSX.Element;
  kg: number;
  repRange: string;
  isDropdownOpen: boolean;
}

interface RoutineItemProps {
  onDelete: () => void;
}

export default function RoutineItem({ onDelete }: RoutineItemProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const excludedDivRef = useRef<HTMLDivElement | null>(null);

  const handleSettingsClick = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        excludedDivRef.current &&
        !excludedDivRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  return (
    <div className="routine-item">
      <div className="routine-item-header">
        <img src="../../../public/DefaultProfilePicture.png" alt="" />
        <p>Name of exercise</p>
        <Icon
          onClick={handleSettingsClick}
          className="routine-settings-icon"
          name="ellipsis-vertical"
        />
        <div
          ref={excludedDivRef}
          className={`routine-settings-popup ${
            !isSettingsOpen ? "hidden" : ""
          }`}
        >
          <p onClick={onDelete}>Delete exercise</p>
          <p>Switch sets</p>
          {/*Andrej*/}
        </div>
      </div>
      <div className="routine-item-body">
        <ExerciseSet />
      </div>
    </div>
  );
}

function ExerciseSet() {
  const [sets, setSets] = useState<Set[]>([
    { id: uuidv4(), set: 1, kg: 0, repRange: "0", isDropdownOpen: false },
  ]);

  const addSet = () => {
    const newSet = {
      id: uuidv4(),
      set: sets.length + 1,
      kg: 0,
      repRange: "0",
      isDropdownOpen: false,
    };
    setSets([...sets, newSet]);
  };

  const handleSetClick = (id: string) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.id === id
          ? { ...set, isDropdownOpen: !set.isDropdownOpen }
          : { ...set, isDropdownOpen: false }
      )
    );
  };

  return (
    <div className="excersice-set">
      <div className="excersice-set-placeholder">
        <p>SET</p>
        <p>INTENSITY</p>
        <p>VOLUME</p>
      </div>
      {sets.map((set) => (
        <div key={set.id} className="excersice-set-item">
          <div className="set-button">
            <p onClick={() => handleSetClick(set.id)}>{set.set}</p>
            <div
               className={`set-dropdown-menu ${!set.isDropdownOpen ? "hidden" : ""}`}
            >
              <p><Icon className="set-icon" name="1" /></p>
              <p>
                <Icon className="set-icon" name="w" />
              </p>
              <p>
                <Icon className="set-icon" name="d" />
              </p>
              <p>
                <Icon className="set-icon" name="f" />
              </p>
              <p>
                <Icon className="set-icon x" name="xmark" />
              </p>
            </div>
          </div>
          <div>
            <input type="text" placeholder={set.kg.toString()} maxLength={4} />
          </div>
          <div>
            <input type="text" placeholder={set.repRange} maxLength={4} />
          </div>
        </div>
      ))}
      <div className="icon-wrapper">
        <Icon onClick={addSet} className="add-set-icon" name="plus" />
      </div>
    </div>
  );
}