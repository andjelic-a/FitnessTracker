import { getProfileCache } from "../../Pages/Profile/ProfileCache";
import createLoader from "../../BetterRouter/CreateLoader";

const splitCreatorLoader = createLoader(() => {
  const cache = getProfileCache();
  if (cache)
    return {
      user: cache.user.then((x) => (x.code === "OK" ? x.content : null)),
    };

  return null;
}, "/me/split/new");

export default splitCreatorLoader;
