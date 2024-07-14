import "./WindowWrapper.scss";
import { AnimatePresence, useIsPresent } from "framer-motion";
import { ReactNode, useEffect } from "react";
import AnimatedLayout from "./AnimatedLayout";

type WindowWrapperProps = {
  children: ReactNode;
};

export default function WindowWrapper({ children }: WindowWrapperProps) {
  const isPresent = useIsPresent();
  useEffect(() => {
    console.log(isPresent);
  }, [isPresent]);

  return (
    <AnimatedLayout>
      <AnimatePresence>{children}</AnimatePresence>
    </AnimatedLayout>
  );
}
