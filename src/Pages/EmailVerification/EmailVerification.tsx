import useLoaderData from "../../BetterRouter/UseLoaderData";
import emailVerificationLoader from "./EmailVerificationLoader";
import Async from "../../Components/Async/Async";
import { useContext } from "react";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";
import { Link } from "react-router-dom";

export default function EmailVerification() {
  const data = useLoaderData<typeof emailVerificationLoader>();
  const basicInfo = useContext(basicProfileInfoContext);

  return (
    <Async await={data.response}>
      {(response) => {
        return (
          <div>
            {response.code === "No Content"
              ? "Successfully verified your email"
              : "Error verifying email"}

            <Link to={`/${basicInfo?.username ?? ""}`}>Home</Link>
          </div>
        );
      }}
    </Async>
  );
}
