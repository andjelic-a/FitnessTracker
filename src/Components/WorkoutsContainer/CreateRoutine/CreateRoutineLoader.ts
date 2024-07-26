import { getProfileCache } from "../../../Pages/Profile/ProfileCache";
import createLoader from "../../../BetterRouter/CreateLoader";

const createRoutineLoader = createLoader("/me/workout/new", () => {
  const cache = getProfileCache();
  if (cache)
    return {
      user: cache.user.then((x) => (x.code === "OK" ? x.content : null)),
    };

  return null;
});

export default createRoutineLoader;
