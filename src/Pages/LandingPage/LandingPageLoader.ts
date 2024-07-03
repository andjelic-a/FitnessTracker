import { defer } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";

export async function landingPageLoaderInner() {
  return sendAPIRequest("/api/exercise/{id}/detailed", {
    method: "get",
    parameters: {
      id: 1,
    },
  });
}

export default async function landingPageLoader() {
  return defer({
    test: landingPageLoaderInner(),
  });
}
