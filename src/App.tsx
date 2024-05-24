import { Outlet } from "react-router-dom";
import "./App.scss";
import HamburgerNavigationMenu from "./Components/HamburgerNavigationMenu/HamburgerNavigationMenu";

function App() {
  return (
    <>
      <section id="page">
        <header>
          <HamburgerNavigationMenu
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
          <h1>Fitness Tracker</h1>
        </header>

        <section id="page-content">
          <Outlet />
        </section>
      </section>
    </>
  );
}

export default App;
