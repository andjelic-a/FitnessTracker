import "./RoutineItem.scss";
import { useState, useEffect, useRef } from "react";
import Icon from "../../../Icon/Icon.tsx";
import useOutsideClick from "../../../../Hooks/UseOutsideClick.ts";
import Observer from "gsap/Observer";
import { Schema } from "../../../../Types/Endpoints/SchemaParser.ts";
import RoutineExerciseDisplay from "./RoutineExerciseDisplay.tsx";

//TODO:? Make rir field or the entire routine item change color or tint based on type of set
export type Set = {
  id: string;
  idx: number;
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
  onDelete: () => void;
  onRequestExerciseReplace: (id: string) => void;
  onDragStart?: (ref: HTMLDivElement) => void;
  onDrag?: (xDelta: number, yDelta: number) => void;
  onDragEnd?: (ref: HTMLDivElement) => void;
  onMouseOver?: (ref: HTMLDivElement) => void;
  onChange: (routineItem: RoutineItemData) => void;
  routineItem: RoutineItemData;
}

export default function RoutineItem({
  onDelete,
  onRequestExerciseReplace,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseOver,
  onChange,
  routineItem,
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
    onRequestExerciseReplace(routineItem.id);
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

  const handleImageScaleToggle = (image: HTMLImageElement) =>
    void image.classList.toggle("big");

  const handleSetsChanged = (newSets: Set[]) => {
    onChange({
      id: routineItem.id,
      exercise: routineItem.exercise,
      sets: newSets,
    });
  };

  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    setSets(routineItem.sets);
  }, [routineItem.sets]);

  useEffect(() => {
    if (isBeingDragged.current) return;
    handleSetsChanged(sets);
  }, [sets]);

  return (
    <div
      className="routine-item"
      id={`routine-item-${routineItem.id}`}
      ref={routineItemWrapperRef}
    >
      <div className="routine-item-header">
        <img
          src={routineItem.exercise.image}
          onClick={(e) => handleImageScaleToggle(e.target as HTMLImageElement)}
        />
        <p>{routineItem.exercise.name}</p>
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
          // onChange={handleSetsChanged}
          animationLength={0.2}
          safeGuard={20}
          sets={sets}
          setSets={setSets}
        />
      </div>
    </div>
  );
}
