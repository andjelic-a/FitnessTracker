import createLoader from "./BetterRouter/CreateLoader";
import sendAPIRequest from "./Data/SendAPIRequest";

const appLoader = createLoader(() => {
  return {
    user: sendAPIRequest("/api/user/basic", {
      method: "get",
    }).then((x) => (x.code === "OK" ? x.content : null)),
  };
});

export default appLoader;
