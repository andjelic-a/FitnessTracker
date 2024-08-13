import "./WorkoutItem.scss";
import { useState, useEffect, useRef } from "react";
import Icon from "../../../Icon/Icon.tsx";
import useOutsideClick from "../../../../Hooks/UseOutsideClick.ts";
import Observer from "gsap/Observer";
import { Schema } from "../../../../Types/Endpoints/SchemaParser.ts";
import WorkoutExerciseDisplay from "./WorkoutExerciseDisplay.tsx";

//TODO:? Make rir field or the entire workout item change color or tint based on type of set
export type Set = {
  id: string;
  idx: number;
  rir: number;
  repRange: string;
  isDropdownOpen: boolean;
  selectedIcon: PossibleSetIcon | null;
};

export type PossibleSetIcon = "1" | "w" | "d" | "f";

export type WorkoutItemData = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  sets: Set[];
  id: string;
};

interface WorkoutItemProps {
  onDelete: () => void;
  onRequestExerciseReplace: (id: string) => void;
  onDragStart?: (ref: HTMLDivElement) => void;
  onDrag?: (xDelta: number, yDelta: number) => void;
  onDragEnd?: (ref: HTMLDivElement) => void;
  onMouseOver?: (ref: HTMLDivElement) => void;
  onChange: (workoutItem: WorkoutItemData) => void;
  workoutItem: WorkoutItemData;
}

export default function WorkoutItem({
  onDelete,
  onRequestExerciseReplace,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseOver,
  onChange,
  workoutItem,
}: WorkoutItemProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const excludedDivRef = useRef<HTMLDivElement | null>(null);
  const workoutItemWrapperRef = useRef<HTMLDivElement>(null);
  const observer = useRef<Observer | null>(null);
  const isBeingDragged = useRef(false);
  const onMouseOverCallbackRef = useRef<
    ((ref: HTMLDivElement) => void) | undefined
  >(undefined);

  const handleReplaceExerciseClick = () => {
    setIsSettingsOpen(false);
    onRequestExerciseReplace(workoutItem.id);
  };

  useEffect(() => {
    observer.current = Observer.create({
      target: workoutItemWrapperRef.current,
      type: "touch,pointer",
      preventDefault: true,
      dragMinimum: 20,
      onDragStart: () => {
        isBeingDragged.current = true;

        if (workoutItemWrapperRef.current)
          onDragStart?.(workoutItemWrapperRef.current);
      },
      onDragEnd: () => {
        isBeingDragged.current = false;

        if (workoutItemWrapperRef.current)
          onDragEnd?.(workoutItemWrapperRef.current);
      },
      onDrag: (x) => {
        onDrag?.(x.deltaX, x.deltaY);
      },
      onHover: (x) => {
        onMouseOverCallbackRef.current?.(x.target as HTMLDivElement);
      },
    });

    return () => observer.current?.kill();
  }, [workoutItemWrapperRef]);

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
      id: workoutItem.id,
      exercise: workoutItem.exercise,
      sets: newSets,
    });
  };

  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    setSets(workoutItem.sets);
  }, [workoutItem.sets]);

  useEffect(() => {
    if (isBeingDragged.current) return;
    handleSetsChanged(sets);
  }, [sets]);

  return (
    <div
      className="workout-item"
      id={`workout-item-${workoutItem.id}`}
      ref={workoutItemWrapperRef}
    >
      <div className="workout-item-header">
        <img
          src={workoutItem.exercise.image}
          onClick={(e) => handleImageScaleToggle(e.target as HTMLImageElement)}
        />
        <p>{workoutItem.exercise.name}</p>
        <Icon
          onClick={handleSettingsClick}
          className="workout-settings-icon"
          name="ellipsis-vertical"
        />
        <div
          ref={excludedDivRef}
          className={`workout-settings-popup ${
            !isSettingsOpen ? "hidden" : ""
          }`}
        >
          <p onClick={handleReplaceExerciseClick}>Replace exercise</p>
          <p onClick={onDelete}>Delete exercise</p>
        </div>
      </div>

      <div className="workout-item-body">
        <WorkoutExerciseDisplay
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
