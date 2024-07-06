import {
  useState,
  useEffect,
  useRef,
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import Icon from "../../../Icon/Icon.tsx";
import "./RoutineItem.scss";
import { v4 as uuidv4 } from "uuid";

interface Set {
  id: string;
  set: number | JSX.Element;
  kg: number;
  repRange: string;
}

interface RoutineItemProps {
  onDelete: () => void;
  id: string;
}

export default function RoutineItem({
  onDelete,
  id,
  ...attr
}: RoutineItemProps &
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
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
    <div className="routine-item" id={`routine-item-${id}`} {...attr} draggable>
      <div className="routine-item-header">
        <img src="../../../DefaultProfilePicture.png" alt="" />
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
    { id: uuidv4(), set: 1, kg: 0, repRange: "0" },
  ]);

  const addSet = () => {
    const newSet = {
      id: uuidv4(),
      set: sets.length + 1,
      kg: 0,
      repRange: "0",
    };
    setSets([...sets, newSet]);
  };

  return (
    <div className="excersice-set">
      <div className="excersice-set-placeholder">
        <p>SET</p>
        <p>KG</p>
        <p>REP RANGE</p>
      </div>
      {sets.map((set) => (
        <div key={set.id} className="excersice-set-item">
          <div className="set-button">
            <p>{set.set}</p>
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
