import { useRef } from "react";
import WindowWrapper from "./WindowWrapper";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import { useIsPresent } from "framer-motion";
import { useNavigate } from "react-router-dom";

const WindowFC =
  <T extends {}>(component: (props: T, onClose: () => void) => JSX.Element) =>
  (props: T) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const exists = useIsPresent();
    const navigate = useNavigate();
    const handleClose = () => (exists ? void navigate("..") : void 0);

    useOutsideClick(wrapperRef, handleClose, "left");

    return (
      <WindowWrapper>
        <div ref={wrapperRef}>{component(props, handleClose)}</div>
      </WindowWrapper>
    );
  };

export default WindowFC;
