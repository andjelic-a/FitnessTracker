import { redirect } from "react-router-dom";
import createLoader from "../../../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../../../Data/SendAPIRequest";

const adminUpdateExerciseLoader = createLoader(
  "/admin/exercises/:exerciseId",
  ({ params: { exerciseId } }) => {
    if (!exerciseId) return redirect("/admin/exercises");

    return {
      exercise: sendAPIRequest("/api/exercise/{id}/detailed", {
        method: "get",
        parameters: {
          id: parseInt(exerciseId),
        },
      }),
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
    };
  }
);

export default adminUpdateExerciseLoader;
