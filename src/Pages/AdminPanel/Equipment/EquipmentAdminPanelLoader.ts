import createLoader from "../../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../../Data/SendAPIRequest";

const adminEquipmentLoader = createLoader("/admin/equipment", () => ({
  equipment: sendAPIRequest("/api/equipment", {
    method: "get",
    parameters: {
      limit: -1,
    },
  }),
}));

export default adminEquipmentLoader;
