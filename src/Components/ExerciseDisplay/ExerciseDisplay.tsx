import {
  Await,
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
  useLoaderData,
} from "react-router-dom";
import Exercise from "../../Types/Models/Exercise";
import { Suspense, useEffect } from "react";
import { GetOne, GetOneFetchPromise } from "../../Data/Get";

export default function ExerciseDisplay() {
  const exerciseDefer = useLoaderData() as ReturnType<
    typeof SingleExerciseLoader
  >;
  useEffect(() => console.log(exerciseDefer), [exerciseDefer]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={exerciseDefer}>
        {(exercise: Exercise) => <div>{exercise.name}</div>}
      </Await>
    </Suspense>
  );
}

interface SingleExerciseLoaderArguments extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":exerciseId">>;
}

export const SingleExerciseLoader = async ({
  params: { exerciseId },
}: SingleExerciseLoaderArguments) => {
  if (!exerciseId) throw new Error("No exerciseId provided");
  
  return defer({
    critical1: fetch(`http://192.168.1.100:5054/api/exercise/${exerciseId}`, {
      method: "GET",
    }).then((result) => result.json()),
  });
};
