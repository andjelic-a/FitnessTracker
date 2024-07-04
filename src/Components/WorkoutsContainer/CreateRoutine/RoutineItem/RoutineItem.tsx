import { useState, useEffect, useRef } from "react";
import Icon from "../../../Icon/Icon.tsx";
import "./RoutineItem.scss";

interface Set {
  id: number;
  kg: number;
  repRange: string;
}

export default function RoutineItem() {
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
        {isSettingsOpen && (
          <div ref={excludedDivRef} className="routine-settings-popup">
            <p>Settings Content</p>
            <p>Settings Content</p>
          </div>
        )}
      </div>
      <div className="routine-item-body">
        <ExcersiceSet />
      </div>
    </div>
  );
}

function ExcersiceSet() {
  const [sets, setSets] = useState<Set[]>([{ id: 1, kg: 0, repRange: "0" }]);

  const addSet = () => {
    const newSet = {
      id: sets.length + 1,
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
            <p>{set.id}</p>
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