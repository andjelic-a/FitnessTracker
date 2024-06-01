import { Await, useLoaderData } from "react-router-dom";
import { newExerciseLoader } from "./NewExerciseLoader";
import "./NewExerciseLoader.scss";
import { Suspense, useRef } from "react";
import { Immutable, Narrow } from "../../../../Types/Utility/Models";
import MuscleGroup from "../../../../Types/Models/MuscleGroup";
import Muscle from "../../../../Types/Models/Muscle";
import Equipment from "../../../../Types/Models/Equipment";

type FullMuscleGroup = Immutable<{
  id: number;
  name: string;
  muscles: Immutable<Narrow<Muscle, ["id", "name"]>>[];
}>;

export default function NewExercise() {
  const data = useLoaderData() as ReturnType<typeof newExerciseLoader>;

  const nameFieldRef = useRef<HTMLInputElement>(null);
  const imageFieldRef = useRef<HTMLInputElement>(null);
  const descriptionFieldRef = useRef<HTMLTextAreaElement>(null);

  function connectMuscleGroups(
    muscleGroups: Immutable<Narrow<MuscleGroup, ["id", "name"]>>[],
    muscles: Immutable<Narrow<Muscle, ["id", "name", "muscleGroupId"]>>[]
  ): FullMuscleGroup[] {
    const fullMuscleGroups: FullMuscleGroup[] = [];
    muscleGroups.forEach((muscleGroup) => {
      fullMuscleGroups.push({
        id: muscleGroup.id,
        name: muscleGroup.name,
        muscles: muscles.filter(
          (muscle) => muscle.muscleGroupId === muscleGroup.id
        ),
      });
    });

    return fullMuscleGroups;
  }

  return (
    <div className="new-exercise-container">
      <input type="text" placeholder="Name" ref={nameFieldRef} />
      <input type="file" accept="image/*" ref={imageFieldRef} />
      <textarea placeholder="Description" ref={descriptionFieldRef} />

      <Suspense fallback={<div>Loading...</div>}>
        <Await
          resolve={Promise.all([
            "muscleGroups" in data ? data.muscleGroups : [],
            "muscles" in data ? data.muscles : [],
          ])}
        >
          {([muscleGroups, muscles]: [
            Immutable<Narrow<MuscleGroup, ["id", "name"]>>[],
            Immutable<Narrow<Muscle, ["id", "name", "muscleGroupId"]>>[]
          ]) => (
            <div>
              <div>
                {JSON.stringify(connectMuscleGroups(muscleGroups, muscles))}
              </div>
            </div>
          )}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={"equipment" in data ? data.equipment : []}>
          {(equipment: Immutable<Narrow<Equipment, ["id", "name"]>>) => (
            <div>{JSON.stringify(equipment)}</div>
          )}
        </Await>
      </Suspense>

      <button onClick={save}>Save</button>
    </div>
  );

  async function save() {
    console.log("save");
  }
}
