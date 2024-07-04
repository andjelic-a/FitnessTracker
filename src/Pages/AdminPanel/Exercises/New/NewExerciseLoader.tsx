import { defer } from "react-router-dom";
import sendAPIRequest from "../../../../Data/SendAPIRequest";

export async function newExerciseLoader() {
  return defer({
    muscleGroups: sendAPIRequest("/api/musclegroup/detailed", {
      method: "get",
      parameters: {
        limit: -1,
      },
    }),
    equipment: sendAPIRequest("/api/equipment", {
      method: "get",
      parameters: {
        limit: -1,
      },
    }),
  });
}
