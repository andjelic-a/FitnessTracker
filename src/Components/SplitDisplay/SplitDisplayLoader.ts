import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";

const splitDisplayLoader = createLoader(({ params: { id } }) => {
  if (!id) return redirect("/");

  return {
    split: sendAPIRequest("/api/split/{id}/detailed", {
      method: "get",
      parameters: {
        id,
      },
    }),
  };
}, "/me/split/:id");

export default splitDisplayLoader;
