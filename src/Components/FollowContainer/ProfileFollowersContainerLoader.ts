import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const profileFollowersContainerLoader = createLoader("/me/followers", () => {
  return {
    type: "followers",
    followers: sendAPIRequest("/api/user/me/followers", {
      method: "get",
      parameters: {
        limit: 10,
        offset: 0,
      },
    }).then((x) => (x.code === "OK" ? x.content : [])),
  };
});

export default profileFollowersContainerLoader;
