import "./Exercises.scss";
import {
  Await,
  Outlet,
  defer,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import get from "../../Data/Get";
import { Suspense, useEffect } from "react";
import { Immutable, Narrow } from "../../Types/Utility/Models";
import { FullExercise } from "../../Types/Models/FullExercise";

export default function Exercises() {
  const exercises = useLoaderData() as ReturnType<typeof exerciseLoader>;
  const navigate = useNavigate();

  useEffect(() => console.log("a"), []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercises" in exercises ? exercises.exercises : []}>
        {(
          exercises: Immutable<Narrow<FullExercise, ["id", "name", "image"]>>[]
        ) => (
          <div className="exercises-page-container">
            <Outlet />

            <div className="exercise-cards-container">
              {exercises.map((exercise) => {
                return (
                  <div
                    className="exercise-card"
                    key={exercise.id}
                    onClick={() => navigate(`/exercises/${exercise.id}`)}
                  >
                    <p>{exercise.name}</p>
                    <img
                      src={"data:image/jpeg;base64," + exercise.image}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export const exerciseLoader = async () => {
  return defer({
    exercises: get<FullExercise>("FullExercise", "none", undefined, 10, 0),
  });
};
