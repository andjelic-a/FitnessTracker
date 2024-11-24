import { CompositionEvent, useRef, useState } from "react";
import { extractSetsNoMapping } from "../../Utility/ExtractSetsFromWorkout";
import { CompletedSet } from "./StartedWorkout";
import { Link } from "react-router-dom";

type StartedWorkoutSetsProps = {
  set: ReturnType<typeof extractSetsNoMapping>[number];
  completedInfo: CompletedSet | null;
  setCompletedInfo: (completedInfo: CompletedSet) => void;
};

export default function StartedWorkoutSet({
  set,
  completedInfo,
  setCompletedInfo,
}: StartedWorkoutSetsProps) {
  return (
    <div className="started-workout-set">
      <div className="started-workout-set-header">
        <div className="started-workout-set-image-container">
          <img
            className="started-workout-set-image"
            src={set.exercise.image}
            alt={`Image of exercise named ${set.exercise.name}`}
          />
        </div>

        <Link target="_blank" to={`/exercises/${set.exercise.id}`}>
          <h1>{set.exercise.name}</h1>
        </Link>
      </div>

      <div className="started-workout-set-seactions">
        <p>SET</p>
        <p className="started-workout-set-seaction-2">WEIGHT & REPS</p>
      </div>

      <div className="started-workout-set-body">
        {set.sets.map((innerSet, index) => (
          <SingleSet
            index={index}
            set={innerSet}
            completedInfo={
              completedInfo?.sets.find((x) => x.id === innerSet.id) ?? null
            }
            setCompletedInfo={(newCompletedSet) => {
              if (newCompletedSet.reps <= 0) return;

              const newSets = completedInfo?.sets.slice() ?? [];
              const currentIndex = newSets.findIndex(
                (x) => x.id === newCompletedSet.id
              );
              if (currentIndex >= 0) newSets[currentIndex] = newCompletedSet;
              else newSets.push(newCompletedSet);

              setCompletedInfo({
                id: set.id,
                sets: newSets,
              });
            }}
            key={innerSet.id}
          />
        ))}
      </div>
    </div>
  );
}

type StartedWorkoutSetProps = {
  index: number;
  set: ReturnType<typeof extractSetsNoMapping>[number]["sets"][number];
  completedInfo: CompletedSet["sets"][number] | null;
  setCompletedInfo: (completedInfo: CompletedSet["sets"][number]) => void;
};

function SingleSet({
  index,
  set,
  completedInfo,
  setCompletedInfo,
}: StartedWorkoutSetProps) {
  const [isEditing, setIsEditing] = useState(false);

  const repsInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  function handleBeforeInput(e: CompositionEvent<HTMLInputElement>) {
    const str = e.currentTarget.value;
    const sub = e.data;
    const posStart = e.currentTarget.selectionStart || 0;
    const posEnd = e.currentTarget.selectionEnd || posStart;
    const nextValue = `${str.slice(0, posStart)}${sub}${str.slice(posEnd)}`;

    const parsed = +nextValue;
    if (isNaN(parsed) || parsed < 0) e?.preventDefault();
  }

  return (
    <div className="started-set" key={set.id}>
      <p>{index + 1}</p>

      <div className="complete-inputs">
          <input
            type="text"
            autoComplete="off"
            defaultValue={completedInfo?.reps}
            ref={repsInputRef}
            name="reps"
            onBeforeInput={handleBeforeInput}
            placeholder={`${set.riR} RiR`}
            disabled={(!isEditing && completedInfo) ? true : false}
          />

          <p> x </p>

          <input
            type="text"
            autoComplete="off"
            defaultValue={completedInfo?.weight}
            ref={weightInputRef}
            name="weight"
            onBeforeInput={handleBeforeInput}
            placeholder={`${set.bottomRepRange}-${set.topRepRange}`}
            disabled={(!isEditing && completedInfo) ? true : false}
          />

          <p>KG</p>
        </div>

      <button
        className="set-complete-button"
        onClick={() => {
          if (isEditing) {
            setCompletedInfo({
              id: set.id,
              reps: +(repsInputRef.current?.value ?? 0),
              weight: +(weightInputRef.current?.value ?? 0),
            });
            setIsEditing((x) => !x);
          }
          else if (!completedInfo) {
            setCompletedInfo({
              id: set.id,
              reps: +(repsInputRef.current?.value ?? 0),
              weight: +(weightInputRef.current?.value ?? 0),
            });
          }
          else {
            setIsEditing((x) => !x);
          }
        }}
      >
        {isEditing ? "Done" : completedInfo ? "Edit" : "Complete"}
      </button>
    </div>
  );
}
