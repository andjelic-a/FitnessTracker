import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";

const routineDisplayLoader = createLoader(
  "/me/workout/:id",
  ({ params: { id } }) => {
    if (!id) return redirect("/me");

    return {
      routine: sendAPIRequest("/api/workout/{id}/detailed", {
        method: "get",
        parameters: {
          id: id,
        },
      }),
    };
  }
);

export default routineDisplayLoader;
