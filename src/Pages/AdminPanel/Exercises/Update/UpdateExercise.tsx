import "./UpdateExercise.scss";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import MuscleSelector from "../../Selectors/Muscle/MuscleSelector";
import EquipmentSelector from "../../Selectors/Equipment/EquipmentSelector";
import sendAPIRequest from "../../../../Data/SendAPIRequest";
import compressImage from "../../../../Data/ImageCompression";
import useLoaderData from "../../../../BetterRouter/UseLoaderData";
import adminUpdateExerciseLoader from "./UpdateExerciseLoader";
import Async from "../../../../Components/Async/Async";

export default function UpdateExercise() {
  const navigate = useNavigate();
  const data = useLoaderData<typeof adminUpdateExerciseLoader>();

  const nameFieldRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const descriptionFieldRef = useRef<HTMLTextAreaElement>(null);

  const selectedPrimaryMuscleGroups = useRef<number[]>([]);
  const selectedPrimaryMuscles = useRef<number[]>([]);

  const selectedSecondaryMuscleGroups = useRef<number[]>([]);
  const selectedSecondaryMuscles = useRef<number[]>([]);

  const selectedEquipment = useRef<number[]>([]);

  return (
    <Async
      await={Promise.all([data.exercise, data.muscleGroups, data.equipment])}
    >
      {([exercise, muscleGroups, equipment]) => {
        if (
          exercise.code !== "OK" ||
          muscleGroups.code !== "OK" ||
          equipment.code !== "OK"
        )
          return null;

        return (
          <div className="update-exercise-container">
            <input
              type="text"
              placeholder="Name"
              ref={nameFieldRef}
              defaultValue={exercise.content.name}
            />

            <div className="update-exercise-image-container">
              <h2>Current Image</h2>
              <img ref={imageRef} src={exercise.content.image ?? ""} alt="" />
              <input
                type="file"
                onChange={async (e) => {
                  if (!imageRef.current || !e.target.files) return;
                  imageRef.current.src = await compressImage(e.target.files[0]);
                }}
              />
            </div>

            <textarea
              placeholder="Description"
              ref={descriptionFieldRef}
              defaultValue={exercise.content.description}
            />

            <div className="update-exercise-muscle-selection-container">
              <MuscleSelector
                selectedOnStart={exercise.content.primaryMuscles.map(
                  (x) => x.id
                )}
                title="Primary"
                onSelectionChanged={(muscleGroups, muscles) => {
                  selectedPrimaryMuscleGroups.current = muscleGroups;
                  selectedPrimaryMuscles.current = muscles;
                }}
                muscleGroups={muscleGroups.content}
              />

              <MuscleSelector
                selectedOnStart={exercise.content.secondaryMuscles.map(
                  (x) => x.id
                )}
                title="Secondary"
                onSelectionChanged={(muscleGroups, muscles) => {
                  selectedSecondaryMuscleGroups.current = muscleGroups;
                  selectedSecondaryMuscles.current = muscles;
                }}
                muscleGroups={muscleGroups.content}
              />
            </div>

            <EquipmentSelector
              selectedOnStart={exercise.content.equipment.map((x) => x.id)}
              equipment={equipment.content}
              onSelectionChanged={(equipment) => {
                selectedEquipment.current = equipment;
              }}
            />

            <button
              onClick={() => {
                navigate("/admin/exercises");
                save(exercise.content.id);
              }}
            >
              Save
            </button>

            <button onClick={() => navigate("/admin/exercises")}>Cancel</button>

            <br />
            <br />
            <br />

            <button
              onClick={() => {
                sendAPIRequest("/api/exercise/{id}", {
                  method: "delete",
                  parameters: {
                    id: exercise.content.id,
                  },
                });
                navigate("/admin/exercises");
              }}
            >
              Delete
            </button>
          </div>
        );
      }}
    </Async>
  );

  async function save(id: number) {
    const name = nameFieldRef.current?.value;
    const image = imageRef.current?.src;
    const description = descriptionFieldRef.current?.value;

    if (!name || !image || !description) return;

    const primaryMuscleGroups = selectedPrimaryMuscleGroups.current;
    const primaryMuscles = selectedPrimaryMuscles.current;

    const secondaryMuscleGroups = selectedSecondaryMuscleGroups.current;
    const secondaryMuscles = selectedSecondaryMuscles.current;

    const equipment = selectedEquipment.current;

    await sendAPIRequest("/api/exercise", {
      method: "put",
      payload: {
        id,
        name,
        description,
        image,
        equipment,
        primaryMuscleGroups,
        secondaryMuscleGroups,
        primaryMuscles,
        secondaryMuscles,
      },
    });
  }
}
