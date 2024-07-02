import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense } from "react";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

export default function EmailVerification() {
  const data = useLoaderData() as {
    response: Promise<APIResponse<"/api/user/me/confirmemail/{code}", "patch">>;
  };
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
