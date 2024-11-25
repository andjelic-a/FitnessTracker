import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";
import { getNameFromURLParam } from "../../Utility/FormatURLNameParam";

const workoutDisplayLoader = createLoader(({ params: { name, username } }) => {
  if (!name || !username) return redirect("/");

  return {
    workout: sendAPIRequest("/api/workout/{creator}/{name}", {
      method: "get",
      parameters: {
        creator: username,
        name: getNameFromURLParam(name),
      },
    }),
  };
}, "/:username/workout/:name");

export default workoutDisplayLoader;
