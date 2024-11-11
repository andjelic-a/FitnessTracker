import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const emailVerificationLoader = createLoader(
  ({ params: { code } }) => ({
    response: sendAPIRequest("/api/user/confirm-email/{code}", {
      method: "patch",
      parameters: {
        code: code ?? "",
      },
    }),
  }),
  "/email-verification/:code"
);

export default emailVerificationLoader;
