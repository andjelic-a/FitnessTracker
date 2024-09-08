import "./App.scss";
import { Outlet } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import AppHeader from "./Components/AppHeader/AppHeader";

export const scrollPositionContext = createContext(0);

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
        <AppHeader />

        <scrollPositionContext.Provider value={scrollPosition}>
          <section id="page-content">
            <Outlet />
          </section>
        </scrollPositionContext.Provider>
      </section>
    </>
  );
}

export default App;
