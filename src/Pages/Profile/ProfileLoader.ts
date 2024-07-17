import { redirect } from "react-router-dom";
import { getJWT } from "../../Data/User";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";
import { getProfileCache, setProfileCache } from "./ProfileCache";
import createLoader from "../../BetterRouter/CreateLoader";

export type ProfileData = {
  user: Promise<APIResponse<"/api/user/me/detailed", "get">>;
  workouts: Promise<APIResponse<"/api/workout/personal/simple", "get">>;
  streak: Promise<APIResponse<"/api/user/me/streak", "get">>;
};

const profileLoader = createLoader("/me", async () => {
  if (!(await getJWT())) {
    setProfileCache(null);
    return redirect("/authentication");
  }

  const cache = getProfileCache();
  if (cache) return cache;

  const newData = {
    user: sendAPIRequest("/api/user/me/detailed", {
      method: "get",
    }),
    workouts: sendAPIRequest("/api/workout/personal/simple", {
      method: "get",
      parameters: {
        limit: -1,
      },
    }),
    streak: sendAPIRequest("/api/user/me/streak", {
      method: "get",
      parameters: {},
    }),
  };

  setProfileCache(newData);
  return newData;
});

export default profileLoader;
