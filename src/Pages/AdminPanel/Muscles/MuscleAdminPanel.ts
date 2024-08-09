import createLoader from "../../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../../Data/SendAPIRequest";

const adminMuscleLoader = createLoader(
  () => ({
    muscles: sendAPIRequest("/api/musclegroup/detailed", {
      method: "get",
      parameters: {},
    }),
  }),
  "/admin/muscles"
);

export default adminMuscleLoader;
