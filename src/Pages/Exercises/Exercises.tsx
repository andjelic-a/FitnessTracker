import "./Exercises.scss";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { Immutable, Narrow } from "../../Types/Utility/Models";
import { FullExercise } from "../../Types/Models/FullExercise";
import exerciseLoader from "./ExerciseLoader";

export default function Exercises() {
  const exercises = useLoaderData() as ReturnType<typeof exerciseLoader>;
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercises" in exercises ? exercises.exercises : []}>
        {(
          exercises: Immutable<Narrow<FullExercise, ["id", "name", "image"]>>[]
        ) => (
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
        )}
      </Await>
    </Suspense>
  );
}
