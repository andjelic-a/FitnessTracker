import "./RoutineItem.scss";
import { useState, useEffect, useRef } from "react";
import Icon from "../../../Icon/Icon.tsx";
import useOutsideClick from "../../../../Hooks/UseOutsideClick.ts";
import Observer from "gsap/Observer";
import { Schema } from "../../../../Types/Endpoints/SchemaParser.ts";
import RoutineExerciseDisplay from "./RoutineExerciseDisplay.tsx";

//TODO: Make rir field disappear when not needed, when warmup or failure is selected
//TODO:? Make rir field or the entire routine item change color or tint based on type of set
export type Set = {
  id: string;
  set: number | JSX.Element;
  rir: number;
  repRange: string;
  isDropdownOpen: boolean;
  selectedIcon: PossibleSetIcon | null;
};

export type PossibleSetIcon = "1" | "w" | "d" | "f";

export type RoutineItemData = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  sets: Set[];
  id: string;
};

interface RoutineItemProps {
  id: string;
  exercise: Schema<"SimpleExerciseResponseDTO">;
  onDelete: () => void;
  onRequestExerciseReplace: (id: string) => void;
  onDragStart?: (ref: HTMLDivElement) => void;
  onDrag?: (xDelta: number, yDelta: number) => void;
  onDragEnd?: (ref: HTMLDivElement) => void;
  onMouseOver?: (ref: HTMLDivElement) => void;
  onChange?: (routineItem: RoutineItemData) => void;
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
}: RoutineItemProps): JSX.Element;

export default function RoutineItem({
  id,
  exercise,
  onDelete,
  onRequestExerciseReplace,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseOver,
  onChange,
}: RoutineItemProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const excludedDivRef = useRef<HTMLDivElement | null>(null);
  const routineItemWrapperRef = useRef<HTMLDivElement>(null);
  const observer = useRef<Observer | null>(null);
  const isBeingDragged = useRef(false);
  const onMouseOverCallbackRef = useRef<
    ((ref: HTMLDivElement) => void) | undefined
  >(undefined);

  const handleReplaceExerciseClick = () => {
    setIsSettingsOpen(false);
    onRequestExerciseReplace(id);
  };

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

  const handleImageScaleUp = (image: HTMLImageElement) =>
    void image.classList.add("big");

  const handleImageScaleDown = (image: HTMLImageElement) =>
    void image.classList.remove("big");

  const handleImageScaleToggle = (image: HTMLImageElement) =>
    void image.classList.toggle("big");

  const handleSetsChanged = (newSets: Set[]) => {
    onChange?.({
      id,
      exercise,
      sets: newSets,
    });
  };

  return (
    <div
      className="routine-item"
      id={`routine-item-${id}`}
      ref={routineItemWrapperRef}
    >
      <div className="routine-item-header">
        <img
          src={exercise.image}
          alt="Exercise"
          onMouseOver={(e) => handleImageScaleUp(e.target as HTMLImageElement)}
          onMouseLeave={(e) =>
            handleImageScaleDown(e.target as HTMLImageElement)
          }
          onClick={(e) => handleImageScaleToggle(e.target as HTMLImageElement)}
        />
        <p>{exercise.name}</p>
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
          <p onClick={handleReplaceExerciseClick}>Replace exercise</p>
          <p onClick={onDelete}>Delete exercise</p>
        </div>
      </div>
      <div className="routine-item-body">
        <RoutineExerciseDisplay
          onStartDraggingSet={() => observer.current?.disable()}
          onEndDraggingSet={() => observer.current?.enable()}
          onExerciseSetChanged={handleSetsChanged}
          animationLength={0.2}
          safeGuard={20}
        />
      </div>
    </div>
  );
}
