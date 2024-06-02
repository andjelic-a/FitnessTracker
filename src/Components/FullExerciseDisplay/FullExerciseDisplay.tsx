import "./FullExerciseDisplay.scss";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { FullExercise } from "../../Types/Models/FullExercise";
import { Immutable } from "../../Types/Utility/Models";
import singleExerciseLoader from "./SingleExerciseLoader";

export default function FullExerciseDisplay() {
  const data = useLoaderData() as ReturnType<typeof singleExerciseLoader>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercise" in data ? data.exercise : null}>
        {(exercise: Immutable<FullExercise>) => (
          <div className="full-exercise-display">
            <img src={exercise.image} alt="" />
            <div className="info">
              <h1>{exercise.name}</h1>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}
