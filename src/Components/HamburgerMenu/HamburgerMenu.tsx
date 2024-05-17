import { useRef } from "react";
import "./HamburgerMenu.scss";

function HamburgerMenu() {

  const hamburgerMenuRef = useRef<HTMLDivElement>(null);
  
  const ClickHandler = () => {
    hamburgerMenuRef.current?.classList.toggle("active");
    console.log(hamburgerMenuRef);
  }

  return (
    <>
      <div className="hamburger-menu" ref={hamburgerMenuRef} onClick={ClickHandler}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </>
  );
}

export default HamburgerMenu;
