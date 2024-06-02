import { Await, useLoaderData } from "react-router-dom";
import { newExerciseLoader } from "./NewExerciseLoader";
import "./NewExercise.scss";
import { Suspense, useRef } from "react";
import { Immutable, Narrow } from "../../../../Types/Utility/Models";
import MuscleGroup from "../../../../Types/Models/MuscleGroup";
import Muscle from "../../../../Types/Models/Muscle";
import Equipment from "../../../../Types/Models/Equipment";
import MuscleSelector from "../../Selectors/Muscle/MuscleSelector";
import Exercise from "../../../../Types/Models/Exercise";
import { compressImage } from "../../../../Data/ImageCompression";
import { post } from "../../../../Data/Post";
import EquipmentSelector from "../../Selectors/Equipment/EquipmentSelector";

export type FullMuscleGroup = Immutable<{
  id: number;
  name: string;
  muscles: Immutable<Narrow<Muscle, ["id", "name"]>>[];
}>;

export default function NewExercise() {
  const data = useLoaderData() as ReturnType<typeof newExerciseLoader>;

  const nameFieldRef = useRef<HTMLInputElement>(null);
  const imageFieldRef = useRef<HTMLInputElement>(null);
  const descriptionFieldRef = useRef<HTMLTextAreaElement>(null);

  const selectedPrimaryMuscleGroups = useRef<number[]>([]);
  const selectedPrimaryMuscles = useRef<number[]>([]);

  const selectedSecondaryMuscleGroups = useRef<number[]>([]);
  const selectedSecondaryMuscles = useRef<number[]>([]);

  const selectedEquipment = useRef<number[]>([]);

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
            <div className="new-exercise-muscle-selection-container">
              <MuscleSelector
                selectedOnStart={[]}
                title="Primary"
                onSelectionChanged={(muscleGroups, muscles) => {
                  selectedPrimaryMuscleGroups.current = muscleGroups;
                  selectedPrimaryMuscles.current = muscles;
                }}
                muscleGroups={connectMuscleGroups(muscleGroups, muscles)}
              />

              <MuscleSelector
                selectedOnStart={[]}
                title="Secondary"
                onSelectionChanged={(muscleGroups, muscles) => {
                  selectedSecondaryMuscleGroups.current = muscleGroups;
                  selectedSecondaryMuscles.current = muscles;
                }}
                muscleGroups={connectMuscleGroups(muscleGroups, muscles)}
              />
            </div>
          )}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={"equipment" in data ? data.equipment : []}>
          {(equipment: Immutable<Narrow<Equipment, ["id", "name"]>>[]) => (
            <EquipmentSelector
              equipment={equipment}
              onSelectionChanged={(equipment) => {
                selectedEquipment.current = equipment;
              }}
            />
          )}
        </Await>
      </Suspense>

      <button onClick={save}>Save</button>
    </div>
  );

  async function save() {
    console.log(
      "primary",
      selectedPrimaryMuscleGroups.current,
      selectedPrimaryMuscles.current
    );
    console.log(
      "secondary",
      selectedSecondaryMuscleGroups.current,
      selectedSecondaryMuscles.current
    );
    console.log("equipment", selectedEquipment.current);

    console.log("save");

    if (
      !nameFieldRef.current ||
      !nameFieldRef.current.value ||
      !imageFieldRef.current ||
      !imageFieldRef.current.files ||
      !descriptionFieldRef.current ||
      !descriptionFieldRef.current.value
    )
      return;

    const name = nameFieldRef.current.value;
    const image = imageFieldRef.current.files[0];
    const description = descriptionFieldRef.current.value;

    const primaryMuscleGroups = selectedPrimaryMuscleGroups.current;
    const primaryMuscles = selectedPrimaryMuscles.current;

    const secondaryMuscleGroups = selectedSecondaryMuscleGroups.current;
    const secondaryMuscles = selectedSecondaryMuscles.current;

    const equipment = selectedEquipment.current;

    const exercise: Exercise = new Exercise(
      0,
      name,
      description,
      await compressImage(image),
      equipment,
      primaryMuscleGroups,
      secondaryMuscleGroups,
      primaryMuscles,
      secondaryMuscles,
      [] //TODO: add aliases
    );

    console.log(exercise);
    await post("exercise", exercise);
  }
}
