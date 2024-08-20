import { getProfileCache } from "../../Pages/Profile/ProfileCache";
import createLoader from "../../BetterRouter/CreateLoader";

const workoutCreatorLoader = createLoader(() => {
  const cache = getProfileCache();
  if (cache)
    return {
      user: cache.user.then((x) => (x.code === "OK" ? x.content : null)),
    };

  return null;
}, "/me/workout/new");

export default workoutCreatorLoader;
