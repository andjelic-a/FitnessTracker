import { defer } from "react-router-dom";
import get from "../../../../Data/Get";
import MuscleGroup from "../../../../Types/Models/MuscleGroup";
import Muscle from "../../../../Types/Models/Muscle";
import Equipment from "../../../../Types/Models/Equipment";

export async function newExerciseLoader() {
  return defer({
    muscleGroups: get<MuscleGroup>("MuscleGroup", "none", undefined, -1, 0),
    muscles: get<Muscle>("Muscle", "none", undefined, -1, 0),
    equipment: get<Equipment>("Equipment", "none", undefined, -1, 0),
  });
}
