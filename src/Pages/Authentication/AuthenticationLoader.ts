import { redirect } from "react-router-dom";
import { hasJWT } from "../../Data/User";
import createLoader from "../../BetterRouter/CreateLoader";

const authenticationLoader = createLoader("/authentication", () => {
  if (hasJWT()) return redirect("/me");

  return null;
});

export default authenticationLoader;
