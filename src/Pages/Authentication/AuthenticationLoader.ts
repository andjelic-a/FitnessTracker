import { redirect } from "react-router-dom";
import createLoader from "../../BetterRouter/CreateLoader";
import { getJWT } from "../../Data/User";

const authenticationLoader = createLoader(async () => {
  if (await getJWT()) return redirect("/");

  return null;
});

export default authenticationLoader;
