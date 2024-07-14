import { AnimatePresence } from "framer-motion";
import { cloneElement } from "react";
import { useLocation, useOutlet } from "react-router-dom";

const AnimatedOutlet = (): React.JSX.Element => {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={true}>
      {element && cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
