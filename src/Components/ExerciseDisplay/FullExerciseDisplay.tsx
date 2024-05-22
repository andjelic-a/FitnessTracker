import "./FullExerciseDisplay.scss";
import {
  Await,
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
  useLoaderData,
} from "react-router-dom";
import Exercise from "../../Types/Models/Exercise";
import { Suspense } from "react";
import { getOne } from "../../Data/Get";

export default function FullExerciseDisplay() {
  const data = useLoaderData() as ReturnType<typeof SingleExerciseLoader>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercise" in data ? data.exercise : null}>
        {(exercise: Exercise) => (
          <div className="full-exercise-display">
            <h1>{exercise.name}</h1>
          </div>
        )}
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
    exercise: getOne<Exercise>("exercise", exerciseId),
  });
};
