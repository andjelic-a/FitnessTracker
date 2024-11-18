import createLoader from "./BetterRouter/CreateLoader";
import sendAPIRequest from "./Data/SendAPIRequest";

const appLoader = createLoader(() => {
  if (localStorage.getItem("token") === null)
    return {
      user: Promise.resolve(null),
    };

  return {
    user: sendAPIRequest("/api/user/basic", {
      method: "get",
    }).then((x) => (x.code === "OK" ? x.content : null)),
  };
});

export default appLoader;
