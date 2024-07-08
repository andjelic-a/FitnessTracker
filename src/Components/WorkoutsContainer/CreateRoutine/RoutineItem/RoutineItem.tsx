import "./RoutineItem.scss";
import {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  useCallback,
} from "react";
import Icon from "../../../Icon/Icon.tsx";
import { v4 as uuidv4 } from "uuid";
import useOutsideClick from "../../../../Hooks/UseOutsideClick.ts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import Observer from "gsap/Observer";
import reorderArray from "../ReorderArray.ts";

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
  onDrag?: (xDelta: number, yDelta: number) => void;
  onDragEnd?: (ref: HTMLDivElement) => void;
  onMouseOver?: (ref: HTMLDivElement) => void;
}

/**
 * Renders a RoutineItem component.
 *
 * @param {Object} props - The props object containing the following properties:
 *   - onDelete: A function to be called when the delete button is clicked.
 *   - id: A unique identifier for the RoutineItem.
 *   - onDragStart: A function to be called when the dragging of the RoutineItem starts.
 *   - onDrag: A function to be called when the RoutineItem is dragged.
 *   - onDragEnd: A function to be called when the dragging of the RoutineItem ends.
 *   - onMouseOver: A function to be called when the RoutineItem is hovered.
 * @return {JSX.Element} The rendered RoutineItem component.
 */
export default function RoutineItem({
  onDelete,
  id,
  onDragStart,
  onDrag,
  onDragEnd,
  onMouseOver,
}: RoutineItemProps): JSX.Element {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const excludedDivRef = useRef<HTMLDivElement | null>(null);
  const routineItemWrapperRef = useRef<HTMLDivElement>(null);
  const observer = useRef<Observer | null>(null);
  const isBeingDragged = useRef(false);
  const onMouseOverCallbackRef = useRef<
    ((ref: HTMLDivElement) => void) | undefined
  >(undefined);

  useEffect(() => {
    observer.current = Observer.create({
      target: routineItemWrapperRef.current,
      type: "touch,pointer",
      preventDefault: true,
      dragMinimum: 20,
      onDragStart: () => {
        isBeingDragged.current = true;

        if (routineItemWrapperRef.current)
          onDragStart?.(routineItemWrapperRef.current);
      },
      onDragEnd: () => {
        isBeingDragged.current = false;

        if (routineItemWrapperRef.current)
          onDragEnd?.(routineItemWrapperRef.current);
      },
      onDrag: (x) => {
        onDrag?.(x.deltaX, x.deltaY);
      },
      onHover: (x) => {
        onMouseOverCallbackRef.current?.(x.target as HTMLDivElement);
      },
    });

    return () => observer.current?.kill();
  }, [routineItemWrapperRef]);

  useEffect(
    () => void (onMouseOverCallbackRef.current = onMouseOver),
    [onMouseOver]
  );

  useOutsideClick(excludedDivRef, () => {
    if (isSettingsOpen) setIsSettingsOpen(false);
  });

  const handleSettingsClick = () => void setIsSettingsOpen(!isSettingsOpen);

  return (
    <div
      className="routine-item"
      id={`routine-item-${id}`}
      ref={routineItemWrapperRef}
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
        <ExerciseSet
          onStartDraggingSet={() => observer.current?.disable()}
          onEndDraggingSet={() => observer.current?.enable()}
          animationLength={0.2}
          safeGuard={20}
        />
      </div>
    </div>
  );
}
//#endregion

//**********************************************************ExerciseSet***************************************************************************\\
//#region ExerciseSet
type ExerciseSetProps = {
  onStartDraggingSet?: () => void;
  onEndDraggingSet?: () => void;
  safeGuard?: number;
  animationLength?: number;
};

/**
 * Renders an exercise set component with a list of sets and options to add, delete, and reorder sets.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onStartDraggingSet - Callback function to be called when the set is being dragged.
 * @param {Function} props.onEndDraggingSet - Callback function to be called when the set dragging ends.
 * @param {number} props.safeGuard - Represents duration of a safe guard which gets activated when a user begins dragging, this prevents sets from teleporting.
 * @param {number} props.animationLength - Represents length of each animation triggered when dragging a set.
 * @return {JSX.Element} Exercise set component.
 */
function ExerciseSet({
  onStartDraggingSet,
  onEndDraggingSet,
  animationLength,
  safeGuard,
}: ExerciseSetProps): JSX.Element {
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

  useOutsideClick(excludedDivRef, () => {
    setSets((prevSets) =>
      prevSets.map((set) => ({ ...set, isDropdownOpen: false }))
    );
  });

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

  const deleteSet = (id: string) => {
    setSets((prevSets) => {
      const updatedSets = prevSets.filter((set) => set.id !== id);

      return updatedSets.map((set, index) => ({
        ...set,
        set: index + 1,
      }));
    });
  };

  const { contextSafe } = useGSAP();
  const dragging = useRef<HTMLElement | null>(null);
  const currentFlipState = useRef<Flip.FlipState | null>(null);
  const currentFlipTimeline = useRef<gsap.core.Timeline | null>(null);
  const isDraggingAvailable = useRef(true);
  const isDragging = useRef(false);
  const preAnimationRect = useRef<DOMRect | undefined>(undefined);
  const setContainerRef = useRef<HTMLDivElement>(null);
  const isMoveAvailable = useRef(true);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      let element = document.elementFromPoint(touch.clientX, touch.clientY);

      while (element && !element.classList.contains("exercise-set-item"))
        element = element.parentElement;

      if (!element) return;

      handleHoverOverItem(element as HTMLElement);
    },
    [handleHoverOverItem]
  );

  useEffect(() => {
    document.addEventListener("touchmove", handleTouchMove);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTouchMove]);

  useEffect(() => {
    preAnimationRect.current = dragging.current?.getBoundingClientRect();
    playReorderAnimation();
  }, [sets]);

  const playReorderAnimation = contextSafe(() => {
    if (!currentFlipState.current) return;
    isMoveAvailable.current = false;
    setTimeout(() => void (isMoveAvailable.current = true), safeGuard ?? 20);

    gsap.set(setContainerRef.current!.childNodes, {
      x: 0,
      y: 0,
    });

    currentFlipTimeline.current = Flip.from(currentFlipState.current, {
      duration: animationLength ?? 0.2,
      onComplete: () => {
        currentFlipState.current = null;
        currentFlipTimeline.current = null;
      },
    });

    return;
  });

  function handleHoverOverItem(target: HTMLElement) {
    if (
      !isDragging.current ||
      !dragging.current ||
      dragging.current.contains(target) ||
      !isMoveAvailable.current
    )
      return;

    let element: HTMLElement | null = target;
    while (element && !element.classList.contains("exercise-set-item")) {
      element = element.parentNode as HTMLElement;
    }
    if (!element) return;

    const hoverId = element.id.replace("exercise-set-item-", "");
    const hoverIdx = sets.findIndex((x) => x.id === hoverId);

    const draggingId = dragging.current!.id.replace("exercise-set-item-", "");
    const draggingIdx = sets.findIndex((x) => x.id === draggingId);

    if (
      hoverIdx === undefined ||
      draggingIdx === undefined ||
      hoverIdx === draggingIdx
    )
      return;

    if (currentFlipTimeline.current) {
      currentFlipTimeline.current.kill();
      currentFlipTimeline.current = null;
    }
    currentFlipState.current = Flip.getState(
      ".exercise-set-item:not(.temporary)"
    );

    setSets(reorderArray(sets, draggingIdx, hoverIdx));
  }

  const beginDragging = contextSafe((element: HTMLElement) => {
    if (!isDraggingAvailable) return;
    isDraggingAvailable.current = false;
    onStartDraggingSet?.();

    element.classList.add("dragging");
    dragging.current = element;
    isDragging.current = true;
  });

  const endDragging = contextSafe(() => {
    if (isDraggingAvailable.current || !isDragging.current || !dragging.current)
      return;

    dragging.current.classList.remove("dragging");
    isDragging.current = false;
    onEndDraggingSet?.();
  });

  return (
    <div className="exercise-set" ref={setContainerRef}>
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
          dropDownMenuWrapper={excludedDivRef}
          onDragStart={beginDragging}
          onDragEnd={endDragging}
          onMouseOver={handleHoverOverItem}
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
  dropDownMenuWrapper?: MutableRefObject<(HTMLDivElement | null)[]>;
  onSetClick?: (id: string) => void;
  onDeleteSet?: (id: string) => void;
  onChangeSetIcon?: (id: string, icon: string) => void;
  onDragStart?: (ref: HTMLDivElement) => void;
  onDragEnd?: (ref: HTMLDivElement) => void;
  onMouseOver?: (ref: HTMLDivElement) => void;
};

/**
 * Renders a single exercise set component with options to click, delete, and change the set icon.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.set - The exercise set object containing the set data.
 * @param {number} props.index - The index of the set in the list of sets.
 * @param {MutableRefObject<(HTMLDivElement | null)[]>} props.dropDownMenuWrapper - Optional reference to the react RefObject of HTMLDivElement[] which represents the dropdown menus of all sets.
 * @param {Function} props.onSetClick - Optional callback function to be called when the set is clicked.
 * @param {Function} props.onDeleteSet - Optional callback function to be called when the set is deleted.
 * @param {Function} props.onChangeSetIcon - Optional callback function to be called when the set icon is changed.
 * @param {Function} props.onDragEnd - Optional callback function to be called when the set dragging ends.
 * @param {Function} props.onDragStart - Optional callback function to be called when the set is dragging starts.
 * @param {Function} props.onMouseOver - Optional callback function to be called when the mouse hovers over the set.
 * @return {JSX.Element} The single exercise set component.
 */
function SingleExerciseSet({
  set,
  index,
  dropDownMenuWrapper,
  onSetClick,
  onDeleteSet,
  onChangeSetIcon,
  onDragEnd,
  onDragStart,
  onMouseOver,
}: SingleExerciseSetProps): JSX.Element {
  const setWrapperRef = useRef<HTMLDivElement>(null);

  const onMouseOverCallbackRef = useRef<
    ((ref: HTMLDivElement) => void) | undefined
  >(undefined);

  useEffect(
    () => void (onMouseOverCallbackRef.current = onMouseOver),
    [onMouseOver]
  );

  useEffect(() => {
    const observer = Observer.create({
      target: setWrapperRef.current,
      type: "touch,pointer",
      preventDefault: true,
      dragMinimum: 10,
      onDragStart: () => {
        if (setWrapperRef.current) onDragStart?.(setWrapperRef.current);
      },
      onDragEnd: () => {
        if (setWrapperRef.current) onDragEnd?.(setWrapperRef.current);
      },
      onHover: (x) => {
        onMouseOverCallbackRef.current?.(x.target as HTMLDivElement);
      },
    });

    return () => observer.kill();
  }, [setWrapperRef]);

  return (
    <div
      className="exercise-set-item"
      ref={setWrapperRef}
      id={`exercise-set-item-${set.id}`}
    >
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
            dropDownMenuWrapper
              ? (dropDownMenuWrapper.current[index] = element)
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
