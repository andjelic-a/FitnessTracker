import { redirect } from "react-router-dom";
import { getJWT } from "../../Data/User";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { getProfileCache, ProfileData, setProfileCache } from "./ProfileCache";
import createLoader from "../../BetterRouter/CreateLoader";

const profileLoader = createLoader(async () => {
  console.log("Profile loader called");

  if (!(await getJWT())) {
    setProfileCache(null);
    return redirect("/authentication");
  }

  const cache = getProfileCache();
  if (cache) return cache;

  const newData: ProfileData = {
    user: sendAPIRequest("/api/user/me/detailed", {
      method: "get",
    }),
    streak: sendAPIRequest("/api/user/me/streak", {
      method: "get",
      parameters: {},
    }),
    latestWeekOfActivity: sendAPIRequest("/api/user/me/streak/week/{date}", {
      method: "get",
      parameters: {
        date: (() => {
          const today = new Date();
          const formatted = `${today.getUTCFullYear()}-${
            today.getUTCMonth() + 1
          }-${today.getUTCDate()}`;
          return formatted;
        })(),
      },
    }),
    pins: sendAPIRequest("/api/user/me/pins", { method: "get" }),
  };

  setProfileCache(newData);
  return newData;
}, "/me");

export default profileLoader;
