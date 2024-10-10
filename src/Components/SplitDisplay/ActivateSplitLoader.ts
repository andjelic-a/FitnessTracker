import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";
import { setProfileCache } from "../../Pages/Profile/ProfileCache";

const activatesplitLoader = createLoader(async ({ params: { id } }) => {
  if (!id) return redirect("/me");

  await sendAPIRequest("/api/user/me/split", {
    method: "patch",
    payload: {
      splitId: id,
    },
  });

  setProfileCache(null);
  return redirect(`/me`);
}, "/activate-split/:id");

export default activatesplitLoader;
