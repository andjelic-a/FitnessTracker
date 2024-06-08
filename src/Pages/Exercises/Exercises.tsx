import "./Exercises.scss";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Immutable, Narrow } from "../../Types/Utility/Models";
import { FullExercise } from "../../Types/Models/FullExercise";
import exerciseLoader from "./ExerciseLoader";
import { testContext } from "../../App";
import get from "../../Data/Get";

export default function Exercises() {
  const exercises = useLoaderData() as ReturnType<typeof exerciseLoader>;
  const scrollPositionContext = useContext(testContext);
  const [lazyLoadedExercises, setLazyLoadedExercises] = useState<
    Immutable<Narrow<FullExercise, ["id", "name", "image"]>>[]
  >([]);

  const offset = useRef(10);
  const lastRecordedScrollPosition = useRef(0);
  const isLoadingExercises = useRef(false);

  useEffect(() => {
    if (
      scrollPositionContext > 0.7 &&
      lastRecordedScrollPosition.current < 0.7 &&
      !isLoadingExercises.current
    ) {
      isLoadingExercises.current = true;
      get<FullExercise>(
        "FullExercise",
        "none",
        undefined,
        10,
        offset.current
      ).then((newExercises) => {
        console.log(newExercises, offset.current);
        if (newExercises.length === 0) return;

        isLoadingExercises.current = false;
        setLazyLoadedExercises([...lazyLoadedExercises, ...newExercises]);
      });

      offset.current += 10;
    }

    lastRecordedScrollPosition.current = scrollPositionContext;
  }, [scrollPositionContext]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercises" in exercises ? exercises.exercises : []}>
        {(
          initialExercises: Immutable<
            Narrow<FullExercise, ["id", "name", "image"]>
          >[]
        ) => {
          return (
            <InnerExercises
              exercises={[...initialExercises, ...lazyLoadedExercises]}
            />
          );
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
