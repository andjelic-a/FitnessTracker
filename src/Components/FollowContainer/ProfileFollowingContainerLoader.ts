import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const profileFollowingContainerLoader = createLoader("/me/following", () => {
  return {
    type: "following",
    following: sendAPIRequest("/api/user/me/following", {
      method: "get",
      parameters: {
        limit: 10,
        offset: 0,
      },
    }).then((x) => (x.code === "OK" ? x.content : [])),
  };
});

export default profileFollowingContainerLoader;
