import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const emailVerificationLoader = createLoader(({ params: { code } }) => {
  sessionStorage.setItem("revalidate-main", "true");

  return {
    response: sendAPIRequest("/api/user/confirm-email/{code}", {
      method: "patch",
      parameters: {
        code: code ?? "",
      },
    }),
  };
}, "/email-verification/:code");

export default emailVerificationLoader;
