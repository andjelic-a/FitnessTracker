import { Suspense } from "react";
import { Await, useNavigate } from "react-router-dom";
import useLoaderData from "../../../BetterRouter/UseLoaderData";
import adminExerciseLoader from "./AdminExercisesLoader";

export default function AdminExercisePanel() {
  const data = useLoaderData<typeof adminExerciseLoader>();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data.exercises}>
        {(exercises: Awaited<(typeof data)["exercises"]>) => {
          if (exercises.code !== "OK") return null;

          return (
            <div className="exercises-admin-panel-container">
              {exercises.content.map((exercise) => {
                return (
                  <div
                    className="exercise-card"
                    key={exercise.id}
                    onClick={() => navigate(`${exercise.id}`)}
                  >
                    <p>{exercise.name}</p>
                  </div>
                );
              })}

              <button onClick={() => navigate("new")}>Add Exercise</button>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
