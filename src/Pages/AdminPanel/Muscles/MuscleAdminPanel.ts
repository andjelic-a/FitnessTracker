import { defer } from "react-router-dom";
import sendAPIRequest from "../../../Data/SendAPIRequest";

export default function muscleAdminPanelLoader() {
  return defer({
    muscles: sendAPIRequest("/api/musclegroup/detailed", {
      method: "get",
      parameters: {},
    }),
  });
}
