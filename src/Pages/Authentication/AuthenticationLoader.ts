import { redirect } from "react-router-dom";
import createLoader from "../../BetterRouter/CreateLoader";
import { getJWT } from "../../Data/User";

const authenticationLoader = createLoader("/authentication", async () => {
  if (await getJWT()) return redirect("/me");

  return null;
});

export default authenticationLoader;
