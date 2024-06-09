import "./Exercises.scss";
import { Await, Link, useLoaderData, useSearchParams } from "react-router-dom";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { Immutable, Narrow } from "../../Types/Utility/Models";
import { FullExercise } from "../../Types/Models/FullExercise";
import exerciseLoader from "./ExerciseLoader";
import { testContext } from "../../App";
import get from "../../Data/Get";
import InputField from "../../Components/InputField/InputField";

export default function Exercises() {
  const exercises = useLoaderData() as ReturnType<typeof exerciseLoader>;
  const scrollPositionContext = useContext(testContext);
  const [lazyLoadedExercises, setLazyLoadedExercises] = useState<
    Immutable<Narrow<FullExercise, ["id", "name", "image"]>>[]
  >([]);

  const offset = useRef(10);
  const lastRecordedScrollPosition = useRef(0);
  const isLoadingExercises = useRef(false);

  let [, setSearchParams] = useSearchParams();
  const searchBarRef = useRef<HTMLInputElement>(null);

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

  //If back button doesn't work with search params use this
  /*   useEffect(() => {
    const previousSearchParams = sessionStorage.getItem("previousQuery");
    if (previousSearchParams) setSearchParams(previousSearchParams);

    const handlePopState = () => {
      const previousSearchParams = sessionStorage.getItem("previousQuery");
      if (previousSearchParams) setSearchParams(previousSearchParams);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []); */

  return (
    <div>
      <div className="filters-container">
        <InputField
          placeholder="Search exercises..."
          iconName="search"
          inputRef={searchBarRef}
        />
        <button
          onClick={() => {
            setSearchParams((x) => {
              searchBarRef.current?.value
                ? x.set("name", searchBarRef.current.value)
                : x.delete("name");

              return x;
            });
          }}
        >
          Filter
        </button>
      </div>

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
    </div>
  );
}

function InnerExercises({
  exercises,
}: {
  exercises: Immutable<Narrow<FullExercise, ["id", "name", "image"]>>[];
}) {
  return (
    <div className="exercises-page-container">
      {exercises.map((exercise) => {
        return (
          <Link
            className="exercise-card"
            to={`/exercises/${exercise.id}`}
            key={exercise.id}
          >
            <p>{exercise.name}</p>
            <img src={exercise.image} alt="" />
          </Link>
        );
      })}
    </div>
  );
}
