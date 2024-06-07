import "./Exercises.scss";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import React, { Suspense, useContext, useEffect } from "react";
import { Immutable, Narrow } from "../../Types/Utility/Models";
import { FullExercise } from "../../Types/Models/FullExercise";
import exerciseLoader from "./ExerciseLoader";
import { testContext } from "../../App";

export default function Exercises() {
  const exercises = useLoaderData() as ReturnType<typeof exerciseLoader>;
  const scrollPositionContext = useContext(testContext);

  useEffect(() => {
    console.log(scrollPositionContext);

    if (scrollPositionContext > 0.7) {
    }
  }, [scrollPositionContext]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercises" in exercises ? exercises.exercises : []}>
        {(
          initialExercises: Immutable<
            Narrow<FullExercise, ["id", "name", "image"]>
          >[]
        ) => {
          return <InnerExercises exercises={[...initialExercises]} />;
        }}
      </Await>
    </Suspense>
  );
}

function InnerExercises({
  exercises,
}: {
  exercises: Immutable<Narrow<FullExercise, ["id", "name", "image"]>>[];
}) {
  const navigate = useNavigate();

  return (
    <div className="exercises-page-container">
      {exercises.map((exercise) => {
        return (
          <div
            className="exercise-card"
            key={exercise.id}
            onClick={() => navigate(`/exercises/${exercise.id}`)}
          >
            <p>{exercise.name}</p>
            <img src={exercise.image} alt="" />
          </div>
        );
      })}
    </div>
  );
}
