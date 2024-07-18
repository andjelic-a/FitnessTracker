import { motion as Motion, Variant, Variants } from "framer-motion";
import { ReactNode, useMemo } from "react";
import "./WindowWrapper.scss";

type AnimatedLayoutProps = {
  children: ReactNode;
  variants?: AnimatedLayoutVariants;
};

export type AnimatedLayoutVariants = {
  hidden: Variant;
  enter: Variant;
  exit: Variant;
};

const AnimatedLayout = ({
  children,
  variants,
}: AnimatedLayoutProps): React.JSX.Element => {
  const defaultVariants = useMemo<Variants>(
    () => ({
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
    }),
    []
  );

  return (
    <Motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants ?? defaultVariants}
      transition={{ duration: 0.3, type: "easeInOut" }}
      className="window-wrapper"
    >
      {children}
    </Motion.div>
  );
};

export default AnimatedLayout;
