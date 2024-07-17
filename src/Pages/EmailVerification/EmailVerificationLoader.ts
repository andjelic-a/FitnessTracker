import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const emailVerificationLoader = createLoader(
  "/email-verification/:code",
  ({ params: { code } }) => ({
    response: sendAPIRequest("/api/user/me/confirmemail/{code}", {
      method: "patch",
      parameters: {
        code: code ?? "",
      },
    }),
  })
);

export default emailVerificationLoader;
