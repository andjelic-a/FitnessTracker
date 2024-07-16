import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

export const landingPageLoader = createLoader("/exercises", () => {
  return {
    exercises: sendAPIRequest("/api/exercise", {
      method: "get",
      parameters: {},
    }),
  };
});
