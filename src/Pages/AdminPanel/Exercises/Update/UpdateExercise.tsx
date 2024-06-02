import { Await, useLoaderData } from "react-router-dom";
import "./UpdateExercise.scss";
import singleExerciseLoader from "../../../../Components/FullExerciseDisplay/SingleExerciseLoader";
import { Immutable } from "../../../../Types/Utility/Models";
import { FullExercise } from "../../../../Types/Models/FullExercise";
import { Suspense } from "react";

export default function UpdateExercise() {
  const data = useLoaderData() as ReturnType<typeof singleExerciseLoader>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercise" in data ? data.exercise : null}>
        {(exercise: Immutable<FullExercise>) => (
          <div className="update-exercise">
            <h1>{exercise.name}</h1>
          </div>
        )}
      </Await>
    </Suspense>
  );
}
