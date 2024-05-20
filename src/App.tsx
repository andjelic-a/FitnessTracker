import { Outlet } from "react-router-dom";
import Navigation from "./Components/Navigation/Navigation";
import "./App.scss";
import Icon from "./Components/Icon/Icon";
import { Suspense, useState } from "react";

function App() {
  const [isNavigationShown, setIsNavigationShown] = useState(false);

  return (
    <>
      <div id="page">
        <div id="header">
          <h1>
            <Icon
              style={{ cursor: "pointer" }}
              name="hamburger"
              onClick={() => setIsNavigationShown(!isNavigationShown)}
            />
            &nbsp; Fitness Tracker &nbsp;
            <Icon name="dumbbell" />
          </h1>
        </div>

        <Navigation shown={isNavigationShown} />

        <Suspense fallback={<div>Loading...</div>}>
          <div id="page-content">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </>
  );
}

export default App;
