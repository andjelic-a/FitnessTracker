import React, { createContext } from "react";
import { WorkoutItemData } from "../Components/CreateWorkout/WorkoutItem/WorkoutItem";

const CurrentEditingWorkoutSetsContext = createContext<{
  currentSets: WorkoutItemData[];
  setCurrentSets: React.Dispatch<React.SetStateAction<WorkoutItemData[]>>;
}>({
  currentSets: [],
  setCurrentSets: () => {},
});

export default CurrentEditingWorkoutSetsContext;
