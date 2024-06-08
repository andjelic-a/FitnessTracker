import { defer } from "react-router-dom";
import get from "../../../Data/Get";
import { FullExercise } from "../../../Types/Models/FullExercise";

export default async function allExercisesLoader() {
  return defer({
    exercises: get<FullExercise>("FullExercise", "none", undefined, -1, 0),
  });
}
