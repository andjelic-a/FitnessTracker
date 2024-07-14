import { ReactNode } from "react";

type WindowWrapperProps = {
  children: ReactNode;
};

export default function WindowWrapper({ children }: WindowWrapperProps) {
  return <div className="window" style={{
    position: "sticky",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80rem",
    height: "80rem",
    borderRadius: "0.5rem",
  }}>{children}</div>;
}
