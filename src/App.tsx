import LandingPage from "./Pages/LandingPage";
import HamburgerMenu from "./Components/HamburgerMenu/HamburgerMenu";
import "./App.scss";

function App() {
  return (
    <>
      <header>
        <HamburgerMenu />
      </header>
      <LandingPage />
    </>
  );
}

export default App;
