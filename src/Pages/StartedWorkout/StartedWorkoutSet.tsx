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
      <img
        src={set.exercise.image}
        alt={`Image of exercise named ${set.exercise.name}`}
      />

      <Link to={`/exercises/${set.exercise.id}`}>
        <h1>{set.exercise.name}</h1>
      </Link>

      <div className="started-sets">
        {set.sets.map((innerSet) => (
          <SingleSet
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
  set: ReturnType<typeof extractSetsNoMapping>[number]["sets"][number];
  completedInfo: CompletedSet["sets"][number] | null;
  setCompletedInfo: (completedInfo: CompletedSet["sets"][number]) => void;
};

function SingleSet({
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
    if (isNaN(parsed) || parsed <= 0) e?.preventDefault();
  }

  return (
    <div className="started-set" key={set.id}>
      <p className="set-info">
        <span>
          {set.type === 0
            ? `${set.riR} RiR`
            : set.type === 1
            ? "Warmup"
            : "Failure"}
        </span>

        <span>
          {set.bottomRepRange === set.topRepRange
            ? set.bottomRepRange
            : `${set.bottomRepRange}-${set.topRepRange}`}
        </span>
      </p>

      {isEditing ? (
        <div className="complete-inputs">
          <input
            type="text"
            autoComplete="off"
            defaultValue={completedInfo?.reps}
            ref={repsInputRef}
            placeholder="Completed reps: "
            name="reps"
            onBeforeInput={handleBeforeInput}
          />

          <input
            type="text"
            autoComplete="off"
            defaultValue={completedInfo?.weight}
            ref={weightInputRef}
            placeholder="Used weight in KG: "
            name="weight"
            onBeforeInput={handleBeforeInput}
          />
        </div>
      ) : !completedInfo ? (
        <></>
      ) : (
        <p className="set-completed-info">
          <span>{completedInfo.reps}</span>
          <span> x </span>
          <span>{completedInfo.weight}KG</span>
        </p>
      )}

      <button
        onClick={() => {
          if (isEditing)
            setCompletedInfo({
              id: set.id,
              reps: +(repsInputRef.current?.value ?? 0),
              weight: +(weightInputRef.current?.value ?? 0),
            });

          setIsEditing((x) => !x);
        }}
      >
        {isEditing ? "Done" : completedInfo ? "Edit" : "Complete"}
      </button>
    </div>
  );
}
