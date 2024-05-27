import "./Exercises.scss";
import {
  Await,
  Outlet,
  defer,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import get from "../../Data/Get";
import Exercise from "../../Types/Models/Exercise";
import { Suspense } from "react";
import { Immutable, Narrow } from "../../Types/Utility/Models";

export default function Exercises() {
  const exercises = useLoaderData() as ReturnType<typeof exerciseLoader>;
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercises" in exercises ? exercises.exercises : []}>
        {(
          exercises: Immutable<Narrow<Exercise, ["id", "name", "images"]>>[]
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
                    {exercise.name}
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
    exercises: get<Exercise>("exercise", "images", undefined, 10, 0),
  });
};
