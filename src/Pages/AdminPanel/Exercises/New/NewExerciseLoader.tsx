import sendAPIRequest from "../../../../Data/SendAPIRequest";
import createLoader from "../../../../BetterRouter/CreateLoader";

const adminNewExerciseLoader = createLoader(
  () => ({
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
  }),
  "/admin/exercises/new"
);

export default adminNewExerciseLoader;
