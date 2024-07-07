import { useState, useEffect, useRef, MutableRefObject } from "react";
import Icon from "../../../Icon/Icon.tsx";
import "./RoutineItem.scss";
import { v4 as uuidv4 } from "uuid";
import Observer from "gsap/Observer";
import useOutsideClick from "../../../../Hooks/UseOutsideClick.ts";

interface Set {
  id: string;
  set: number | JSX.Element;
  kg: number;
  repRange: string;
  isDropdownOpen: boolean;
  selectedIcon: string | null;
}

//**********************************************************RoutineItem***************************************************************************\\
//#region RoutineItem
interface RoutineItemProps {
  onDelete: () => void;
  id: string;
  onDragStart?: (ref: HTMLDivElement) => void;
  onDragEnd?: (ref: HTMLDivElement) => void;
  onDrag?: (xDelta: number, yDelta: number) => void;
  onMouseOver?: (ref: HTMLDivElement) => void;
}

export default function RoutineItem({
  onDelete,
  id,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseOver,
}: RoutineItemProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const excludedDivRef = useRef<HTMLDivElement | null>(null);

  const handleSettingsClick = () => void setIsSettingsOpen(!isSettingsOpen);

  useOutsideClick(excludedDivRef, () => {
    if (isSettingsOpen) setIsSettingsOpen(false);
  });

  const routineItemsWrapperRef = useRef<HTMLDivElement>(null);

  const onMouseOverCallbackRef = useRef<
    ((ref: HTMLDivElement) => void) | undefined
  >(undefined);

  useEffect(
    () => void (onMouseOverCallbackRef.current = onMouseOver),
    [onMouseOver]
  );

  useEffect(() => {
    const observer = Observer.create({
      target: routineItemsWrapperRef.current,
      type: "touch,pointer",
      preventDefault: true,
      dragMinimum: 15,
      onDragStart: () => {
        if (routineItemsWrapperRef.current)
          onDragStart?.(routineItemsWrapperRef.current);
      },
      onDragEnd: () => {
        if (routineItemsWrapperRef.current)
          onDragEnd?.(routineItemsWrapperRef.current);
      },
      onDrag: (x) => {
        onDrag?.(x.deltaX, x.deltaY);
      },
      onHover: (x) => {
        onMouseOverCallbackRef.current?.(x.target as HTMLDivElement);
      },
    });

    return () => observer.kill();
  }, [routineItemsWrapperRef]);

  return (
    <div
      className="routine-item"
      id={`routine-item-${id}`}
      ref={routineItemsWrapperRef}
    >
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
          <p>Replace exercise</p>
        </div>
      </div>
      <div className="routine-item-body">
        <ExerciseSet />
      </div>
    </div>
  );
}
//#endregion

//**********************************************************ExerciseSet***************************************************************************\\
//#region ExerciseSet
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

  useOutsideClick(excludedDivRef, () => {
    setSets((prevSets) =>
      prevSets.map((set) => ({ ...set, isDropdownOpen: false }))
    );
  });

  const deleteSet = (id: string) => {
    setSets((prevSets) => {
      const updatedSets = prevSets.filter((set) => set.id !== id);

      return updatedSets.map((set, index) => ({
        ...set,
        set: index + 1,
      }));
    });
  };

  const changeSetIcon = (id: string, icon: string) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.id === id
          ? icon === "1"
            ? {
                ...set,
                selectedIcon: null,
                set: prevSets.length + 1,
                isDropdownOpen: false,
              }
            : { ...set, selectedIcon: icon, isDropdownOpen: false }
          : set
      )
    );
  };

  return (
    <div className="exercise-set">
      <div className="exercise-set-placeholder">
        <p>SET</p>
        <p>INTENSITY</p>
        <p>VOLUME</p>
      </div>
      {sets.map((set, index) => (
        <SingleExerciseSet
          key={set.id}
          set={set}
          index={index}
          onSetClick={handleSetClick}
          onDeleteSet={deleteSet}
          onChangeSetIcon={changeSetIcon}
          excludedDivRef={excludedDivRef}
        />
      ))}
      <div className="icon-wrapper">
        <Icon onClick={addSet} className="add-set-icon" name="plus" />
      </div>
    </div>
  );
}
//#endregion

//**********************************************************SingleExerciseSet*********************************************************************\\
//#region SingleExerciseSet
type SingleExerciseSetProps = {
  set: Set;
  index: number;
  onSetClick?: (id: string) => void;
  onDeleteSet?: (id: string) => void;
  onChangeSetIcon?: (id: string, icon: string) => void;
  excludedDivRef?: MutableRefObject<(HTMLDivElement | null)[]>;
};

function SingleExerciseSet({
  set,
  index,
  onSetClick,
  onDeleteSet,
  onChangeSetIcon,
  excludedDivRef,
}: SingleExerciseSetProps) {
  return (
    <div className="exercise-set-item">
      <div className="set-button">
        <p onClick={() => onSetClick?.(set.id)}>
          {set.selectedIcon ? (
            <Icon className="set-icon" name={set.selectedIcon} />
          ) : (
            set.set
          )}
        </p>
        <div
          ref={(element) =>
            excludedDivRef
              ? (excludedDivRef.current[index] = element)
              : void element
          }
          className={`set-dropdown-menu ${!set.isDropdownOpen ? "hidden" : ""}`}
        >
          <p>
            <Icon
              onClick={() => onChangeSetIcon?.(set.id, "1")}
              className="set-icon"
              name="1"
            />
          </p>
          <p>
            <Icon
              onClick={() => onChangeSetIcon?.(set.id, "w")}
              className="set-icon"
              name="w"
            />
          </p>
          <p>
            <Icon
              onClick={() => onChangeSetIcon?.(set.id, "d")}
              className="set-icon"
              name="d"
            />
          </p>
          <p>
            <Icon
              onClick={() => onChangeSetIcon?.(set.id, "f")}
              className="set-icon"
              name="f"
            />
          </p>
          <p>
            <Icon
              onClick={() => onDeleteSet?.(set.id)}
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
        <input type="text" placeholder={set.repRange} maxLength={4} />
      </div>
    </div>
  );
}
//#endregion
