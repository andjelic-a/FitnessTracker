import { Await, defer, useLoaderData } from "react-router-dom";
import Get from "../Data/Get";
import Exercise from "../Types/Models/Exercise";
import { Suspense } from "react";
import { Immutable, Narrow } from "../Types/Utility/Models";

export default function Exercises() {
  const exercises = useLoaderData() as ReturnType<typeof ExerciseLoader>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercises" in exercises ? exercises.exercises : []}>
        {(
          exercises: Immutable<Narrow<Exercise, ["id", "name", "images"]>>[]
        ) => (
          <div className="exercises-page-container">
            {exercises.map((exercise) => {
              return <div key={exercise.id}>{exercise.name}</div>;
            })}
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export const ExerciseLoader = async () => {
  return defer({
    exercises: Get<Exercise>("exercise", "images", undefined, 10, 0),
  });
};
