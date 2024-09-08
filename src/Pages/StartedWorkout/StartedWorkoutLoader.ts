import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const startedWorkoutLoader = createLoader(() => {
  return {
    todaysWorkout: sendAPIRequest("/api/user/me/split/today", {
      method: "get",
    }),
  };
});

export default startedWorkoutLoader;
