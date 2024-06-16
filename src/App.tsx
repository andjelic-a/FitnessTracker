import { Outlet } from "react-router-dom";
import "./App.scss";
import HamburgerNavigationMenu from "./Components/HamburgerNavigationMenu/HamburgerNavigationMenu";
import Icon from "./Components/Icon/Icon";
import { createContext, useEffect, useState } from "react";

export const testContext = createContext(0);

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  });

  function handleScroll() {
    setScrollPosition(
      (window.scrollY + window.innerHeight) / document.body.scrollHeight
    );
  }

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
                alternatePaths: ["/authentication", "/email-verification"],
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

        <testContext.Provider value={scrollPosition}>
          <section id="page-content">
            <Outlet />
          </section>
        </testContext.Provider>

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
