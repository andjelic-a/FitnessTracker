import { defer } from "react-router-dom";
import get from "../../Data/Get";
import { FullExercise } from "../../Types/Models/FullExercise";

export default async function exerciseLoader() {
  return defer({
    exercises: get<FullExercise>("FullExercise", "none", undefined, 10, 0),
  });
}
