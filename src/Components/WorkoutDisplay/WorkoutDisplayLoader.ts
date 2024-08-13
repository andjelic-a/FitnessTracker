import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";

const workoutDisplayLoader = createLoader(({ params: { id } }) => {
  if (!id) return redirect("/me");

  return {
    workout: sendAPIRequest("/api/workout/{id}/detailed", {
      method: "get",
      parameters: {
        id: id,
      },
    }),
  };
}, "/me/workout/:id");

export default workoutDisplayLoader;
