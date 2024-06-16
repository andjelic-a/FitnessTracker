import { Await, useLoaderData, useNavigate } from "react-router-dom";
import emailVerificationLoader from "./EmailVerificationLoader";
import { Suspense } from "react";

export default function EmailVerification() {
  const data = useLoaderData() as ReturnType<typeof emailVerificationLoader>;
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"message" in data ? data.message : null}>
        {(success: boolean) => {
          if (success) navigate("/me");

          return (
            <div>
              {success
                ? "Successfully verified your email"
                : "Error verifying email"}
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
