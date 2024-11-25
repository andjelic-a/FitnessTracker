import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";
import { Schema } from "../../Types/Endpoints/SchemaParser";

const userLoader = createLoader(({ params: { username } }) => {
  if (!username) return redirect("/");

  return {
    user: sendAPIRequest("/api/user/{username}/detailed", {
      method: "get",
      parameters: {
        username,
      },
    }),
    latestWeekOfActivity: sendAPIRequest(
      "/api/user/{username}/streak/week/{date}",
      {
        method: "get",
        parameters: {
          date: (() => {
            const today = new Date();
            const formatted = `${today.getUTCFullYear()}-${
              today.getUTCMonth() + 1
            }-${today.getUTCDate()}`;
            return formatted;
          })(),
          username,
        },
      }
    ),
    pins: sendAPIRequest("/api/user/{username}/pins", {
      method: "get",
      parameters: {
        username,
      },
    }),
    privacySettings: sendAPIRequest("/api/user/{username}/settings", {
      method: "get",
      parameters: {
        username,
      },
    }).then<Schema<"UserSettingsResponseDTO">>((x) =>
      x.code === "OK"
        ? x.content
        : {
            publicCreatedSplits: false,
            publicCreatedWorkouts: false,
            publicFavoriteSplits: false,
            publicFavoriteWorkouts: false,
            publicFollowing: false,
            publicLikedSplits: false,
            publicLikedWorkouts: false,
            publicStreak: false,
            publicCurrentSplit: false,
          }
    ),
  };
}, "/:username");

export default userLoader;
