import "./App.scss";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AppHeader from "./Components/AppHeader/AppHeader";
import sendAPIRequest from "./Data/SendAPIRequest";
import { Schema } from "./Types/Endpoints/SchemaParser";
import basicProfileInfoContext from "./Contexts/BasicProfileInfoContext";

function App() {
  const [basicProfileInfo, setBasicProfileInfo] =
    useState<Schema<"SimpleUserResponseDTO"> | null>(null);
  const sentBasicProfileInfoRequest = useRef(false);

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

  return (
    <>
      <section id="page">
        <basicProfileInfoContext.Provider value={basicProfileInfo}>
          <AppHeader />

          <section id="page-content">
            <Outlet />
          </section>
        </basicProfileInfoContext.Provider>
      </section>
    </>
  );
}

export default App;
