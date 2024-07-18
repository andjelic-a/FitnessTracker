import createLoader from "../../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../../Data/SendAPIRequest";

const adminExerciseLoader = createLoader("/admin/exercises", () => {
  return {
    exercises: sendAPIRequest("/api/exercise", {
      method: "get",
      parameters: {
        limit: -1,
        offset: 0,
      },
    }),
  };
});

export default adminExerciseLoader;
