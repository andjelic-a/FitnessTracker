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

        <Navigation
          shown={isNavigationShown}
          items={[
            {
              name: "Home",
              path: "/",
            },
            {
              name: "Exercises",
              path: "/exercises",
            },
            {
              name: "Workouts",
              path: "/workouts",
            },
            {
              name: "Profile",
              path: "/me",
            },
            {
              name: "Nutrition",
              path: "/nutrition",
            },
          ]}
        />

        <div id="page-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
