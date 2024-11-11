import "./App.scss";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AppHeader from "./Components/AppHeader/AppHeader";
import { Schema } from "./Types/Endpoints/SchemaParser";
import basicProfileInfoContext from "./Contexts/BasicProfileInfoContext";
import useLoaderData from "./BetterRouter/UseLoaderData";
import appLoader from "./AppLoader";

function App() {
  const [basicProfileInfo, setBasicProfileInfo] =
    useState<Schema<"SimpleUserResponseDTO"> | null>(null);

  const loaderData = useLoaderData<typeof appLoader>();
  useEffect(() => void loaderData.user.then(setBasicProfileInfo), [loaderData]);

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
