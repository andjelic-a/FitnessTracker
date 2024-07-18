import "./WindowWrapper.scss";
import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import AnimatedLayout, { AnimatedLayoutVariants } from "./AnimatedLayout";

type WindowWrapperProps = {
  children: ReactNode;
  animationTriggers?: AnimatedLayoutVariants;
};

export default function WindowWrapper({
  children,
  animationTriggers,
}: WindowWrapperProps) {
  return (
    <AnimatedLayout variants={animationTriggers}>
      <AnimatePresence>{children}</AnimatePresence>
    </AnimatedLayout>
  );
}
