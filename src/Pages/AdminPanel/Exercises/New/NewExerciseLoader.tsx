import sendAPIRequest from "../../../../Data/SendAPIRequest";
import createLoader from "../../../../BetterRouter/CreateLoader";

const adminNewExerciseLoader = createLoader("/admin/exercises/new", () => ({
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
}));

export default adminNewExerciseLoader;
