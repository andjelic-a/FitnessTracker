import { Await, useLoaderData } from "react-router-dom";
import "./LandingPage.scss";
import { Suspense } from "react";
import landingPageLoader, { landingPageLoaderInner } from "./LandingPageLoader";

function LandingPage() {
  const data = useLoaderData() as ReturnType<typeof landingPageLoader>;

  return (
    <>
      <h1>Landing Page</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={"test" in data ? data.test : null}>
          {(test: Awaited<ReturnType<typeof landingPageLoaderInner>>) => {
            console.log(test);
            return (
              <>
                {JSON.stringify(test)}
                {test.code === "OK" && <div>Success</div>}
                {test.code === "Not Found" && <div>Not Found</div>}
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

export default LandingPage;
