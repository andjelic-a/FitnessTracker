import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";
import { redirect } from "react-router-dom";

const singleExerciseLoader = createLoader(
  "/exercises/:exerciseId",
  (request) => {
    if (!request.params.exerciseId) return redirect("/exercises");

    return {
      exercise: sendAPIRequest("/api/exercise/{id}/detailed", {
        method: "get",
        parameters: {
          id: parseInt(request.params.exerciseId),
        },
      }),
    };
  }
);

export default singleExerciseLoader;
