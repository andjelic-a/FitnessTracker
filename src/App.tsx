import { Outlet } from "react-router-dom";
import Navigation from "./Components/Navigation/Navigation";
import "./App.scss";
import Icon from "./Components/Icon/Icon";

function App() {
  return (
    <>
      <div id="page">
        <div id="header">
          <h1>
            Fitness Tracker &nbsp;
            <Icon name="dumbbell" />
          </h1>
        </div>

        <Navigation />

        <div id="page-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
