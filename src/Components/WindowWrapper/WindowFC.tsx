import React, { RefObject, useRef } from "react";
import WindowWrapper from "./WindowWrapper";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import { useIsPresent } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AnimatedLayoutVariants } from "./AnimatedLayout";

const WindowFC =
  <T extends {}>(
    component: (
      props: T,
      wrapperRef: RefObject<HTMLDivElement>,
      close: () => void
    ) => React.JSX.Element,
    animationTriggers?: AnimatedLayoutVariants
  ) =>
  (props: T) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const exists = useIsPresent();
    const navigate = useNavigate();
    const handleClose = () => (exists ? void navigate("..") : void 0);

    useOutsideClick(wrapperRef, handleClose, "left");

    return (
      <WindowWrapper animationTriggers={animationTriggers}>
        {component(props, wrapperRef, handleClose)}
      </WindowWrapper>
    );
  };

export default WindowFC;
