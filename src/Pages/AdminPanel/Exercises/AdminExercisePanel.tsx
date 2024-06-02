import { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Immutable, Narrow } from "../../../Types/Utility/Models";
import Exercise from "../../../Types/Models/Exercise";
import exerciseLoader from "../../Exercises/ExerciseLoader";

export default function AdminExercisePanel() {
  const exercises = useLoaderData() as ReturnType<typeof exerciseLoader>;
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercises" in exercises ? exercises.exercises : []}>
        {(
          exercises: Immutable<Narrow<Exercise, ["id", "name", "image"]>>[]
        ) => (
          <div className="exercises-admin-panel-container">
            {exercises.map((exercise) => {
              return (
                <div
                  className="exercise-card"
                  key={exercise.id}
                  onClick={() => navigate(`/exercises/${exercise.id}`)}
                >
                  <p>{exercise.name}</p>
                </div>
              );
            })}

            <button onClick={() => navigate("new")}>Add Exercise</button>
          </div>
        )}
      </Await>
    </Suspense>
  );
}
