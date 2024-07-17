import { Await, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import emailVerificationLoader from "./EmailVerificationLoader";

export default function EmailVerification() {
  const data = useLoaderData<typeof emailVerificationLoader>();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data.response}>
        {(response: Awaited<typeof data.response>) => {
          if (response.code === "No Content") navigate("/me");

          return (
            <div>
              {response.code === "No Content"
                ? "Successfully verified your email"
                : "Error verifying email"}
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
