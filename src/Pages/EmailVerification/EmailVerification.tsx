import { useNavigate } from "react-router-dom";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import emailVerificationLoader from "./EmailVerificationLoader";
import Async from "../../Components/Async/Async";

export default function EmailVerification() {
  const data = useLoaderData<typeof emailVerificationLoader>();
  const navigate = useNavigate();

  return (
    <Async await={data.response}>
      {(response) => {
        if (response.code === "No Content") navigate("/me");

        return (
          <div>
            {response.code === "No Content"
              ? "Successfully verified your email"
              : "Error verifying email"}
          </div>
        );
      }}
    </Async>
  );
}
