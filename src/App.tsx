import "./App.scss";
import { Outlet } from "react-router-dom";
import { createContext, useEffect, useRef, useState } from "react";
import AppHeader from "./Components/AppHeader/AppHeader";
import sendAPIRequest from "./Data/SendAPIRequest";
import { Schema } from "./Types/Endpoints/SchemaParser";
import basicProfileInfoContext from "./Contexts/BasicProfileInfoContext";

export const scrollPositionContext = createContext(0);

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [basicProfileInfo, setBasicProfileInfo] =
    useState<Schema<"SimpleUserResponseDTO"> | null>(null);
  const sentBasicProfileInfoRequest = useRef(false);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (sentBasicProfileInfoRequest.current) return;
    sentBasicProfileInfoRequest.current = true;

    sendAPIRequest("/api/user/basic", {
      method: "get",
    }).then((x) => {
      if (x.code !== "OK") return;

      setBasicProfileInfo(x.content);
    });
  }, []);

  function handleScroll() {
    setScrollPosition(
      (window.scrollY + window.innerHeight) / document.body.scrollHeight
    );
  }

  return (
    <>
      <section id="page">
        <basicProfileInfoContext.Provider value={basicProfileInfo}>
          <scrollPositionContext.Provider value={scrollPosition}>
            <AppHeader />

            <section id="page-content">
              <Outlet />
            </section>
          </scrollPositionContext.Provider>
        </basicProfileInfoContext.Provider>
      </section>
    </>
  );
}

export default App;
