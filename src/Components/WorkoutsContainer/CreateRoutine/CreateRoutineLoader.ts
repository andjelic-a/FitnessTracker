import { defer } from "react-router-dom";
import { getProfileCache } from "../../../Pages/Profile/ProfileCache";

export default async function createRoutineLoader() {
  const cache = getProfileCache();
  if (cache)
    return defer({
      user: cache.user.then((x) => (x.code === "OK" ? x.content : null)),
    });

  return null;
}
