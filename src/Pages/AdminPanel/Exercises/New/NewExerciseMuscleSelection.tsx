import { useEffect, useState } from "react";
import { FullMuscleGroup } from "./NewExercise";
import Muscle from "../../../../Types/Models/Muscle";

type NewExerciseMuscleSelectionProps = {
  muscleGroups: FullMuscleGroup;
  onSelectionChanged: (
    selectedMuscleGroupIds: number[],
    selectedMuscleIds: number[]
  ) => void;
};

export default function NewExerciseMuscleSelection({
  muscleGroups,
  onSelectionChanged,
}: NewExerciseMuscleSelectionProps) {
  const [selectedMuscles, setSelectedMuscles] = useState<Muscle[]>([]);

  useEffect(() => {
    onSelectionChanged(
      selectedMuscles.map((muscle) => muscle.muscleGroupId).removeDuplicates(),
      selectedMuscles.map((muscle) => muscle.id)
    );
  }, [selectedMuscles]);

  return <div>{JSON.stringify(muscleGroups)}</div>;
}
