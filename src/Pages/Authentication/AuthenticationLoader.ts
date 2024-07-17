import { redirect } from "react-router-dom";
import { getJWT } from "../../Data/User";
import createLoader from "../../BetterRouter/CreateLoader";

const authenticationLoader = createLoader("/authentication", async () => {
  if (await getJWT()) return redirect("/me");

  return null;
});

export default authenticationLoader;
