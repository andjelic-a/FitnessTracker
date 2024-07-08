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
  selectedIcon: string | null;
}

interface RoutineItemProps {
  exercise: string;
  onDelete: () => void;
}

export default function RoutineItem({ exercise,onDelete }: RoutineItemProps) {
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
        <p>{exercise}</p>
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
          <p>Replace excersice</p>
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
    {
      id: uuidv4(),
      set: 1,
      kg: 0,
      repRange: "0",
      isDropdownOpen: false,
      selectedIcon: null,
    },
  ]);

  const excludedDivRef = useRef<(HTMLDivElement | null)[]>([]);

  const addSet = () => {
    const newSet = {
      id: uuidv4(),
      set: sets.length + 1,
      kg: 0,
      repRange: "0",
      isDropdownOpen: false,
      selectedIcon: null,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      excludedDivRef.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node)) {
          setSets((prevSets) =>
            prevSets.map((set, i) =>
              i === index ? { ...set, isDropdownOpen: false } : set
            )
          );
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deleteSet = (id: string) => {
    setSets((prevSets) => {
      const updatedSets = prevSets.filter((set) => set.id !== id);

      return updatedSets.map((set, index) => ({
        ...set,
        set: index + 1,
      }));
    });
  };

  const findPositionOfelement = (id: string) => {
    return sets.findIndex((set) => set.id === id);
  };

  const changeSetIcon = (id: string, icon: string) => {
    setSets((prevSets) => {
      return prevSets.map((set) => {
        if (set.id === id) {
          if (icon === "1") {
            console.log("here");
            return {
              ...set,
              selectedIcon: null,
              set: findPositionOfelement(id) + 1,
              isDropdownOpen: false,
            };
          } else {
            return {
              ...set,
              selectedIcon: icon,
              isDropdownOpen: false,
            };
          }
        } else {
          return set;
        }
      });
    });
  };

  return (
    <div className="excersice-set">
      <div className="excersice-set-placeholder">
        <p>SET</p>
        <p>INTENSITY</p>
        <p>VOLUME</p>
      </div>
      {sets.map((set, index) => (
        <div key={set.id} className="excersice-set-item">
          <div className="set-button">
            <p onClick={() => handleSetClick(set.id)}>
              {set.selectedIcon ? (
                <Icon className="set-icon" name={set.selectedIcon} />
              ) : (
                set.set
              )}
            </p>
            <div
              ref={(element) => (excludedDivRef.current[index] = element)}
              className={`set-dropdown-menu ${
                !set.isDropdownOpen ? "hidden" : ""
              }`}
            >
              <p>
                <Icon
                  onClick={() => changeSetIcon(set.id, "1")}
                  className="set-icon"
                  name="1"
                />
              </p>
              <p>
                <div onClick={() => changeSetIcon(set.id, "w")}>Warmup</div>
              </p>
              <p>
                <div onClick={() => changeSetIcon(set.id, "d")}>Drop set</div>
              </p>
              <p>
                <div onClick={() => changeSetIcon(set.id, "f")}>Failure</div>
              </p>
              <p>
                <Icon
                  onClick={() => deleteSet(set.id)}
                  className="set-icon x"
                  name="xmark"
                />
              </p>
            </div>
          </div>
          <div>
            <input type="text" placeholder={set.kg.toString()} maxLength={4} />
          </div>
          <div>
            <input type="text" placeholder={set.repRange} maxLength={5} />
          </div>
        </div>
      ))}
      <div className="icon-wrapper">
        <Icon onClick={addSet} className="add-set-icon" name="plus" />
      </div>
    </div>
  );
}
