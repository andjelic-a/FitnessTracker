import { redirect } from "react-router-dom";
import { getBearerToken } from "../../Data/User";

export default async function authenticationLoader() {
  if (await getBearerToken()) return redirect("/me");

  return null;
}
