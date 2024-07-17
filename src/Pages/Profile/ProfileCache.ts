import { ProfileData } from "./ProfileLoader";

let profileCache: ProfileData | null = null;

export const getProfileCache = () => profileCache;
export const setProfileCache = (data: ProfileData | null) =>
  void (profileCache = data);
