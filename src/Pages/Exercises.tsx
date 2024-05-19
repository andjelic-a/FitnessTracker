import { useLoaderData } from "react-router-dom";
import Get from "../Data/Get";
import Exercise from "../Types/Models/Exercise";
import { useEffect } from "react";

export default function Exercises() {
  const exercises = useLoaderData() as Exercise[];
  useEffect(() => console.log(exercises), [exercises]);

  return <div>Exercises</div>;
}

export const ExerciseLoader = async () =>
  await Get<Exercise>("exercise", "none", undefined, 10, 0);
