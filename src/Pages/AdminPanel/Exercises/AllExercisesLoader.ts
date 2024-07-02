import { defer } from "react-router-dom";
import sendAPIRequest from "../../../Data/SendAPIRequest";

export default async function allExercisesLoader() {
  return defer({
    exercises: sendAPIRequest({
      endpoint: "/api/exercise",
      request: {
        method: "get",
        parameters: {
          limit: -1,
          offset: 0,
        },
      },
    }),
  });
}
