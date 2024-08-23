import { createContext } from "react";
import { Schema } from "../Types/Endpoints/SchemaParser";

export const NewWorkoutsContext = createContext<{
  createdWorkouts: Schema<"SimpleWorkoutResponseDTO">[];
  addWorkout: (workout: Schema<"SimpleWorkoutResponseDTO">) => void;
}>({
  createdWorkouts: [],
  addWorkout: () => {},
});
