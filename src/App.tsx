import { Outlet } from "react-router-dom";
import Navigation from "./Components/Navigation/Navigation";
import "./App.scss";
import { useState } from "react";
import HamburgerMenu from "./Components/HamburgerMenu/HamburgerMenu";

function App() {
  const [isNavigationShown, setIsNavigationShown] = useState(false);

  return (
    <>
      <section id="page">
        <header>
        <HamburgerMenu
              onClick={() => setIsNavigationShown(!isNavigationShown)}
            />
            <h1>Fitness Tracker</h1>
        </header>

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

        <section id="page-content">
          <Outlet />
        </section>
      </section>
    </>
  );
}

export default App;
