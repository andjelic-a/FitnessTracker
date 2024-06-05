import "./Error.scss";
import { Link, useAsyncError, useRouteError } from "react-router-dom";
import Icon from "../Icon/Icon";

type errorResponse = {
  status: number;
  statusText: string;
  data: any;
};

export default function Error() {
  const routeError: errorResponse = useRouteError() as errorResponse;
  const asyncError: errorResponse = useAsyncError() as errorResponse;

  console.log(routeError, asyncError);

  function renderRouteError(error: errorResponse | undefined | null) {
    if (!error) return null;

    if (error.status !== 404)
      return (
        <div className="route-error-container">
          <h2>
            {error.status} {error.statusText}
          </h2>
        </div>
      );

    return (
      <div className="route-error-container">
        <h1>You seem to be lost</h1>
        <h2>
          <Link to="/" className="primary-home-link">
            Here
          </Link>
          &nbsp;is a way to get you back home&nbsp;
          <Link to="/" className="secondary-home-link">
            <Icon name="map" />
          </Link>
        </h2>
      </div>
    );
  }

  function renderAsyncError(error: errorResponse | undefined | null) {
    if (!error) return null;

    return (
      <div className="async-error-container">
        <h1>
          Oh no! Something went wrong <Icon name="face-surprise" />
        </h1>

        <h2>
          {error.status} {error.statusText}
        </h2>
      </div>
    );
  }

  return (
    <div className="error-page-container">
      {renderRouteError(routeError)}
      {renderAsyncError(asyncError)}
    </div>
  );
}
