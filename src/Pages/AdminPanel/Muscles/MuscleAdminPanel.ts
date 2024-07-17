import createLoader from "../../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../../Data/SendAPIRequest";

const adminMuscleLoader = createLoader("/admin/muscles", () => ({
  muscles: sendAPIRequest("/api/musclegroup/detailed", {
    method: "get",
    parameters: {},
  }),
}));

export default adminMuscleLoader;
