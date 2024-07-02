import "./Exercises.scss";
import { Await, Link, useLoaderData, useSearchParams } from "react-router-dom";
import {
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getExerciseQueryString } from "./ExerciseLoader";
import { scrollPositionContext } from "../../App";
import InputField from "../../Components/InputField/InputField";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";
import sendAPIRequest from "../../Data/SendAPIRequest";

export default function Exercises() {
  const data = useLoaderData() as {
    exercises: APIResponse<"/api/exercise", "get">;
  };
  const scrollPositionContextConsumer = useContext(scrollPositionContext);
  const [lazyLoadedExercises, setLazyLoadedExercises] = useState<
    APIResponse<"/api/exercise", "get">[]
  >([]);

  const offset = useRef(10);
  const lastRecordedScrollPosition = useRef(0);
  const isLoadingExercises = useRef(false);

  let [searchParams, setSearchParams] = useSearchParams();
  const searchBarRef = useRef<HTMLInputElement>(null);

  const exercisesLimitPerLoad = useMemo(() => 10, []);

  useEffect(() => {
    setLazyLoadedExercises([]);
  }, [data]);

  useEffect(() => {
    if (
      scrollPositionContextConsumer > 0.7 &&
      lastRecordedScrollPosition.current < 0.7 &&
      !isLoadingExercises.current
    ) {
      isLoadingExercises.current = true;

      sendAPIRequest({
        endpoint: "/api/exercise",
        request: {
          method: "get",
          parameters: {
            q: getExerciseQueryString(searchParams).join(";"),
            offset: offset.current,
            limit: exercisesLimitPerLoad,
          },
        },
      }).then((newExercises) => {
        if (newExercises.code !== "OK") {
          isLoadingExercises.current = false;
          return;
        }

        console.log(newExercises, offset.current);
        setLazyLoadedExercises([...lazyLoadedExercises, newExercises]);

        if (newExercises.content.length === exercisesLimitPerLoad)
          isLoadingExercises.current = false;
      });

      offset.current += 10;
    }

    lastRecordedScrollPosition.current = scrollPositionContextConsumer;
  }, [scrollPositionContextConsumer]);

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
  function handleSearch() {
    setSearchParams((x) => {
      searchBarRef.current?.value
        ? x.set("name", searchBarRef.current.value)
        : x.delete("name");

      return x;
    });
  }

  return (
    <div>
      <div className="filters-container">
        <InputField
          defaultValue={searchParams.get("name") ?? ""}
          placeholder="Search exercises..."
          iconName="search"
          inputRef={searchBarRef}
          onEnter={handleSearch}
        />
        <button onClick={handleSearch}>Filter</button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.exercises}>
          {(initialExercises: Awaited<typeof data.exercises>) => {
            if (initialExercises.code !== "OK") return null;

            return (
              <InnerExercises
                exercises={[initialExercises, ...lazyLoadedExercises]}
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
  exercises: APIResponse<"/api/exercise", "get">[];
}) {
  return (
    <div className="exercises-page-container">
      {exercises
        .flatMap((x) => (x.code === "OK" ? x.content : []))
        .map((exercise) => {
          return (
            <Link
              className="exercise-card"
              to={`/exercises/${exercise.id}`}
              key={exercise.id}
            >
              <p>{exercise.name}</p>
              <img src={exercise.image ?? ""} alt="" />
            </Link>
          );
        })}
    </div>
  );
}
