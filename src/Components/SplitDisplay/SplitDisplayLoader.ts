import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";

const splitDisplayLoader = createLoader(({ params: { name, username } }) => {
  if (!name || !username) return redirect("/");

  return {
    split: sendAPIRequest("/api/split/{creator}/{name}", {
      method: "get",
      parameters: {
        creator: username,
        name: name.replace(/-/g, " "),
      },
    }),
  };
}, "/:username/split/:name");

export default splitDisplayLoader;
