import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";

const routineDisplayLoader = createLoader("/workouts/:workoutId", (request) => {
  if (!request.params.workoutId) return redirect("/me");

  return {
    routine: sendAPIRequest("/api/workout/{id}/detailed", {
      method: "get",
      parameters: {
        id: request.params.workoutId,
      },
    }),
  };
});

export default routineDisplayLoader;
