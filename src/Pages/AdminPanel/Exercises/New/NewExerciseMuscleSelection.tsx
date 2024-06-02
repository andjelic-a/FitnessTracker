import { useEffect, useState } from "react";
import { FullMuscleGroup } from "./NewExercise";
import Muscle from "../../../../Types/Models/Muscle";

type NewExerciseMuscleSelectionProps = {
  selectedOnStart: number[];
  muscleGroups: FullMuscleGroup[];
  onSelectionChanged: (
    selectedMuscleGroupIds: number[],
    selectedMuscleIds: number[]
  ) => void;
  title: "Primary" | "Secondary";
};

export default function NewExerciseMuscleSelection({
  muscleGroups,
  onSelectionChanged,
  title,
  selectedOnStart,
}: NewExerciseMuscleSelectionProps) {
  const [selectedMuscles, setSelectedMuscles] = useState<Muscle[]>([]);

  useEffect(() => {
    setSelectedMuscles(
      muscleGroups
        .flatMap((x) => x.muscles)
        .filter((x) => selectedOnStart.includes(x.id)) as Muscle[]
    );
  }, [selectedOnStart]);

  useEffect(() => {
    onSelectionChanged(
      Array.from(
        new Set(selectedMuscles.map((muscle) => muscle.muscleGroupId))
      ),
      selectedMuscles.map((muscle) => muscle.id)
    );
  }, [selectedMuscles]);

  function selectMuscle(muscle: Muscle) {
    setSelectedMuscles((muscles) => {
      if (muscles.some((x) => x.id === muscle.id)) {
        return muscles.filter((x) => x.id !== muscle.id);
      } else {
        return [...muscles, muscle];
      }
    });
  }

  return (
    <div className="new-exercise-muscle-selection">
      <h1>{title}</h1>
      {muscleGroups.map((x) => (
        <div className="muscle-group" key={"muscle-group-" + x.id}>
          <h1>{x.name}</h1>
          <div className="muscle-group-muscles">
            {x.muscles.map((muscle) => (
              <div
                key={"muscle-" + muscle.id}
                className={`option ${
                  selectedMuscles.some((x) => x.id === muscle.id)
                    ? "selected"
                    : ""
                }`}
                onClick={() => selectMuscle(muscle as Muscle)}
              >
                <p>{muscle.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
