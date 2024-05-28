import "./FullExerciseDisplay.scss";
import {
  Await,
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
  useLoaderData,
} from "react-router-dom";
import { Suspense } from "react";
import { getOne } from "../../Data/Get";
import { FullExercise } from "../../Types/Models/FullExercise";
import { Immutable } from "../../Types/Utility/Models";

export default function FullExerciseDisplay() {
  const data = useLoaderData() as ReturnType<typeof SingleExerciseLoader>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"exercise" in data ? data.exercise : null}>
        {(exercise: Immutable<FullExercise>) => (
          <div className="full-exercise-display">
            <img
              src={
                exercise.images.length > 0 ? exercise.images[0].imageURL : ""
              }
              alt=""
            />
            <div className="info">
              <h1>{exercise.name}</h1>
            </div>
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
    exercise: getOne<FullExercise>("FullExercise", exerciseId, "all"),
  });
};
