import { defer, redirect } from "react-router-dom";
import { getBearerToken, getCurrentUserData } from "../../Data/User";

export default async function profileLoader() {
  if (!(await getBearerToken())) return redirect("/authentication");

  return defer({
    user: getCurrentUserData(),
  });
}
