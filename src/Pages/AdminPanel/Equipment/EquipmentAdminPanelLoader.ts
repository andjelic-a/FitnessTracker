import createLoader from "../../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../../Data/SendAPIRequest";

const adminEquipmentLoader = createLoader(
  () => ({
    equipment: sendAPIRequest("/api/equipment", {
      method: "get",
      parameters: {
        limit: -1,
      },
    }),
  }),
  "/admin/equipment"
);

export default adminEquipmentLoader;
