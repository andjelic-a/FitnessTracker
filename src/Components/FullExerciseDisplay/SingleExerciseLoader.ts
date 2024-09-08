import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";
import { redirect } from "react-router-dom";

const singleExerciseLoader = createLoader((request) => {
  if (!request.params.id) return redirect("/exercises");

  return {
    exercise: sendAPIRequest("/api/exercise/{id}/detailed", {
      method: "get",
      parameters: {
        id: parseInt(request.params.id),
      },
    }),
  };
}, "/exercises/:id");

export default singleExerciseLoader;
