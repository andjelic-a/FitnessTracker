import { redirect } from "react-router-dom";
import { getJWT } from "../../Data/User";

export default async function authenticationLoader() {
  if (await getJWT()) return redirect("/me");

  return null;
}
