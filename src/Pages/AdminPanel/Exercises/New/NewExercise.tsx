import "./NewExercise.scss";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import MuscleSelector from "../../Selectors/Muscle/MuscleSelector";
import compressImage from "../../../../Data/ImageCompression";
import EquipmentSelector from "../../Selectors/Equipment/EquipmentSelector";
import sendAPIRequest from "../../../../Data/SendAPIRequest";
import useLoaderData from "../../../../BetterRouter/UseLoaderData";
import adminNewExerciseLoader from "./NewExerciseLoader";
import Async from "../../../../Components/Async/Async";

export default function NewExercise() {
  const navigate = useNavigate();

  const data = useLoaderData<typeof adminNewExerciseLoader>();

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

      <Async await={data.muscleGroups}>
        {(muscleGroups) => {
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
      </Async>

      <Async await={data.equipment}>
        {(equipment) => {
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
      </Async>

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
