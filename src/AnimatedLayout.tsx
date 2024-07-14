import { motion as Motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const variants: Variants = {
  hidden: {
    opacity: 0,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.5)",
    zIndex: 100000,
  },
  enter: {
    opacity: 1,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(1)",
    zIndex: 100000,
  },
  exit: {
    opacity: 0,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.5)",
    zIndex: 100000,
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
      className="relative"
    >
      {children}
    </Motion.div>
  );
};

export default AnimatedLayout;
