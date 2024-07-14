import { motion as Motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import "./WindowWrapper.scss";

type Props = {
  children: ReactNode;
};

const variants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  enter: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.5,
  },
};

const AnimatedLayout = ({ children }: Props): React.JSX.Element => {
  return (
    <Motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3, type: "easeInOut" }}
      className="window-wrapper"
    >
      {children}
    </Motion.div>
  );
};

export default AnimatedLayout;
