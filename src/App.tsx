import { Outlet } from "react-router-dom";
import "./App.scss";
import HamburgerNavigationMenu from "./Components/HamburgerNavigationMenu/HamburgerNavigationMenu";
import Icon from "./Components/Icon/Icon";

function App() {
  return (
    <>
      <section id="page">
        <header>
          <HamburgerNavigationMenu
            id="navigation"
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
                defaultPath: "/me",
                alternatePaths: ["/login"],
              },
              {
                name: "Nutrition",
                path: "/nutrition",
              },
            ]}
          />
          <h1 id="site-title">Fitness Tracker</h1>
          <Icon id="logo" name="dumbbell" />
        </header>

        <section id="page-content">
          <section>
            <Outlet />
          </section>
        </section>

        <footer>
          <div id="media">
            <a href="#">
              <Icon id="brands" name="instagram" />
            </a>
            <a href="#">
              <Icon id="brands" name="facebook" />
            </a>
            <a href="#">
              <Icon id="brands" name="github" />
            </a>
          </div>
          © 2024 FITNESS TRACKER
        </footer>
      </section>
    </>
  );
}

export default App;
