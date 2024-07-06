import { Await, useLoaderData, useNavigate } from "react-router-dom";
import "./NewExercise.scss";
import { Suspense, useRef } from "react";
import MuscleSelector from "../../Selectors/Muscle/MuscleSelector";
import compressImage from "../../../../Data/ImageCompression";
import EquipmentSelector from "../../Selectors/Equipment/EquipmentSelector";
import { APIResponse } from "../../../../Types/Endpoints/ResponseParser";
import sendAPIRequest from "../../../../Data/SendAPIRequest";

export default function NewExercise() {
  const navigate = useNavigate();

  const data = useLoaderData() as {
    muscleGroups: APIResponse<"/api/musclegroup/detailed", "get">;
    equipment: APIResponse<"/api/equipment", "get">;
  };

  const nameFieldRef = useRef<HTMLInputElement>(null);
  const imageFieldRef = useRef<HTMLInputElement>(null);
  const descriptionFieldRef = useRef<HTMLTextAreaElement>(null);

  const selectedPrimaryMuscleGroups = useRef<number[]>([]);
  const selectedPrimaryMuscles = useRef<number[]>([]);

  const selectedSecondaryMuscleGroups = useRef<number[]>([]);
  const selectedSecondaryMuscles = useRef<number[]>([]);

  const selectedEquipment = useRef<number[]>([]);

  return (
    <div className="new-exercise-container">
      <input type="text" placeholder="Name" ref={nameFieldRef} />
      <input type="file" accept="image/*" ref={imageFieldRef} />
      <textarea placeholder="Description" ref={descriptionFieldRef} />

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.muscleGroups}>
          {(muscleGroups: Awaited<(typeof data)["muscleGroups"]>) => {
            if (muscleGroups.code !== "OK") return null;

            return (
              <div className="new-exercise-muscle-selection-container">
                <MuscleSelector
                  selectedOnStart={[]}
                  title="Primary"
                  onSelectionChanged={(muscleGroups, muscles) => {
                    selectedPrimaryMuscleGroups.current = muscleGroups;
                    selectedPrimaryMuscles.current = muscles;
                  }}
                  muscleGroups={muscleGroups.content}
                />

                <MuscleSelector
                  selectedOnStart={[]}
                  title="Secondary"
                  onSelectionChanged={(muscleGroups, muscles) => {
                    selectedSecondaryMuscleGroups.current = muscleGroups;
                    selectedSecondaryMuscles.current = muscles;
                  }}
                  muscleGroups={muscleGroups.content}
                />
              </div>
            );
          }}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.equipment}>
          {(equipment: Awaited<(typeof data)["equipment"]>) => {
            if (equipment.code !== "OK") return null;

            return (
              <EquipmentSelector
                selectedOnStart={[]}
                equipment={equipment.content}
                onSelectionChanged={(equipment) => {
                  selectedEquipment.current = equipment;
                }}
              />
            );
          }}
        </Await>
      </Suspense>

      <button onClick={save}>Save</button>
    </div>
  );

  async function save() {
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

    await sendAPIRequest("/api/exercise", {
      method: "post",
      payload: {
        name,
        description,
        equipment,
        image: await compressImage(image),
        primaryMuscleGroups,
        primaryMuscles,
        secondaryMuscleGroups,
        secondaryMuscles,
      },
    });

    navigate("/admin/exercises");
  }
}
