import { Await, useLoaderData } from "react-router-dom";
import emailVerificationLoader from "./EmailVerificationLoader";
import { Suspense } from "react";

export default function EmailVerification() {
  const data = useLoaderData() as ReturnType<typeof emailVerificationLoader>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={"message" in data ? data.message : null}>
        {(message: string) => <div>{message}</div>}
      </Await>
    </Suspense>
  );
}
