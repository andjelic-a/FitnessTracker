import "./FullExerciseDisplay.scss";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";
import FormattedText from "../FormattedText/FormattedText";

export default function FullExerciseDisplay() {
  const data = useLoaderData() as {
    exercise: Promise<APIResponse<"/api/exercise/{id}/detailed", "get">>;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data.exercise}>
        {(exercise: Awaited<typeof data.exercise>) => {
          if (exercise.code !== "OK") return null;

          return (
            <div className="full-exercise-display">
              <img src={exercise.content.image ?? ""} alt="" />
              <div className="info">
                <h1>{exercise.content.name}</h1>
                <FormattedText children={exercise.content.description} />

                <h2>Equipment</h2>
                <ul>
                  {exercise.content.equipment.map((equipment) => (
                    <li key={equipment.id}>{equipment.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
