import "./UpdateExercise.scss";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Immutable, Narrow } from "../../../../Types/Utility/Models";
import { FullExercise } from "../../../../Types/Models/FullExercise";
import { Suspense, useRef } from "react";
import FormattedText from "../../../../Components/FormattedText/FormattedText";
import MuscleGroup from "../../../../Types/Models/MuscleGroup";
import Muscle from "../../../../Types/Models/Muscle";
import Equipment from "../../../../Types/Models/Equipment";
import MuscleSelector from "../../Selectors/Muscle/MuscleSelector";
import { connectMuscleGroups } from "../../../../Types/Models/FullMuscleGroup";
import updateExerciseLoader from "./UpdateExerciseLoader";
import EquipmentSelector from "../../Selectors/Equipment/EquipmentSelector";
import Exercise from "../../../../Types/Models/Exercise";
import { put } from "../../../../Data/Put";
import { deleteEntity } from "../../../../Data/Delete";

export default function UpdateExercise() {
  const navigate = useNavigate();
  const data = useLoaderData() as ReturnType<typeof updateExerciseLoader>;

  const selectedPrimaryMuscleGroups = useRef<number[]>([]);
  const selectedPrimaryMuscles = useRef<number[]>([]);

  const selectedSecondaryMuscleGroups = useRef<number[]>([]);
  const selectedSecondaryMuscles = useRef<number[]>([]);

  const selectedEquipment = useRef<number[]>([]);

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
          <div className="update-exercise-container">
            <h1>{exercise.name}</h1>
            <img src={exercise.image} alt="" />
            <FormattedText children={exercise.description} />

            <div className="update-exercise-muscle-selection-container">
              <MuscleSelector
                selectedOnStart={exercise.primaryMuscles.map((x) => x.id)}
                title="Primary"
                onSelectionChanged={(muscleGroups, muscles) => {
                  selectedPrimaryMuscleGroups.current = muscleGroups;
                  selectedPrimaryMuscles.current = muscles;
                }}
                muscleGroups={connectMuscleGroups(muscleGroups, muscles)}
              />

              <MuscleSelector
                selectedOnStart={exercise.secondaryMuscles.map((x) => x.id)}
                title="Secondary"
                onSelectionChanged={(muscleGroups, muscles) => {
                  selectedSecondaryMuscleGroups.current = muscleGroups;
                  selectedSecondaryMuscles.current = muscles;
                }}
                muscleGroups={connectMuscleGroups(muscleGroups, muscles)}
              />
            </div>

            <EquipmentSelector
              selectedOnStart={exercise.equipment.map((x) => x.id)}
              equipment={equipment}
              onSelectionChanged={(equipment) => {
                selectedEquipment.current = equipment;
              }}
            />

            <button
              onClick={() => {
                navigate("/admin/exercises");
                save(
                  exercise.id,
                  exercise.name,
                  exercise.image,
                  exercise.description
                );
              }}
            >
              Save
            </button>

            <br />
            <br />
            <br />

            <button
              onClick={() => {
                navigate("/admin/exercises");
                deleteEntity("exercise", exercise.id);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </Await>
    </Suspense>
  );

  async function save(
    id: number,
    name: string,
    image: string,
    description: string
  ) {
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

    if (!name || !image || !description) return;

    const primaryMuscleGroups = selectedPrimaryMuscleGroups.current;
    const primaryMuscles = selectedPrimaryMuscles.current;

    const secondaryMuscleGroups = selectedSecondaryMuscleGroups.current;
    const secondaryMuscles = selectedSecondaryMuscles.current;

    const equipment = selectedEquipment.current;

    const exercise: Exercise = new Exercise(
      id,
      name,
      description,
      image,
      equipment,
      primaryMuscleGroups,
      secondaryMuscleGroups,
      primaryMuscles,
      secondaryMuscles,
      [] //TODO: add aliases
    );

    console.log(exercise);
    await put("exercise", exercise);
  }
}
