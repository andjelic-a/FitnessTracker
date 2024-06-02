import { Await, useLoaderData } from "react-router-dom";
import "./UpdateExercise.scss";
import singleExerciseLoader from "../../../../Components/FullExerciseDisplay/SingleExerciseLoader";
import { Immutable, Narrow } from "../../../../Types/Utility/Models";
import { FullExercise } from "../../../../Types/Models/FullExercise";
import { Suspense } from "react";
import FormattedText from "../../../../Components/FormattedText/FormattedText";
import MuscleGroup from "../../../../Types/Models/MuscleGroup";
import Muscle from "../../../../Types/Models/Muscle";
import Equipment from "../../../../Types/Models/Equipment";

export default function UpdateExercise() {
  const data = useLoaderData() as ReturnType<typeof singleExerciseLoader>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await
        resolve={Promise.all([
          "exercise" in data ? data.exercise : null,
          "muscleGroups" in data ? data.muscleGroups : [],
          "muscles" in data ? data.muscles : [],
          "equipment" in data ? data.equipment : [],
        ])}
      >
        {([exercise, muscleGroups, muscles, equipment]: [
          Immutable<FullExercise>,
          Immutable<Narrow<MuscleGroup, ["id", "name"]>>[],
          Immutable<Narrow<Muscle, ["id", "name", "muscleGroupId"]>>[],
          Immutable<Narrow<Equipment, ["id", "name"]>>[]
        ]) => (
          <div className="update-exercise">
            <h1>{exercise.name}</h1>
            <img src={exercise.image} alt="" />
            <FormattedText children={exercise.description} />
          </div>
        )}
      </Await>
    </Suspense>
  );
}
