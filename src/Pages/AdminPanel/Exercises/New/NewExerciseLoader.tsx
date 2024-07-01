import { defer } from "react-router-dom";
import sendAPIRequest from "../../../../Data/SendAPIRequest";

export async function newExerciseLoader() {
  return defer({
    muscleGroups: sendAPIRequest({
      endpoint: "/api/musclegroup",
      request: {
        method: "get",
        parameters: {
          limit: -1,
        },
      },
    }),
    muscles: sendAPIRequest({
      endpoint: "/api/muscle",
      request: {
        method: "get",
        parameters: {
          limit: -1,
        },
      },
    }),
    equipment: sendAPIRequest({
      endpoint: "/api/equipment",
      request: {
        method: "get",
        parameters: {
          limit: -1,
        },
      },
    }),
  });
}
