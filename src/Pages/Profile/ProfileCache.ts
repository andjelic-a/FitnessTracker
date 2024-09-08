import { APIResponse } from "../../Types/Endpoints/ResponseParser";

export type ProfileData = {
  user: Promise<APIResponse<"/api/user/me/detailed", "get">>;
  streak: Promise<APIResponse<"/api/user/me/streak", "get">>;
  latestWeekOfActivity: Promise<
    APIResponse<"/api/user/me/streak/week/{date}", "get">
  >;
  pins: Promise<APIResponse<"/api/user/me/pins", "get">>;
};

let profileCache: ProfileData | null = null;

export const getProfileCache = () => profileCache;
export const setProfileCache = (data: ProfileData | null) =>
  void (profileCache = data);
