import { useAsyncError, useRouteError } from "react-router-dom";

export default function Error() {
  const routeError = useRouteError();
  const asyncError = useAsyncError();

  console.log(routeError, asyncError);

  return <div>Error</div>;
}
