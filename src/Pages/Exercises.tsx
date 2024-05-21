import { Await, defer, useLoaderData } from "react-router-dom";
import Get from "../Data/Get";
import Exercise from "../Types/Models/Exercise";
import { Suspense, useEffect } from "react";

export default function Exercises() {
  const exercises = useLoaderData() as ReturnType<typeof ExerciseLoader>;
  useEffect(() => console.log(exercises), [exercises]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/*@ts-expect-error*/}
      <Await resolve={exercises.exercises}>
        {(exercises: Exercise[]) => (
          <div>
            {exercises.map((exercise) => (
              <div key={exercise.id}>{exercise.name}</div>
            ))}
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export const ExerciseLoader = async () => {
  return defer({
    exercises: Get<Exercise>("exercise", "none", undefined, 10, 0),
  });
};
