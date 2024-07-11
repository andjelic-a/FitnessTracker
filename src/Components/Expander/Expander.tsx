import "./Expander.scss";
import Icon from "../Icon/Icon";
import { useState } from "react";

type ExpanderProps = {
  name: string;
  icon?: string;
  children: React.ReactNode;
};

export default function Expander({ name, icon, children }: ExpanderProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="expander" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="expander-header">
        <Icon
          name={icon ?? ""}
          className={`expander-icon ${icon ? "visible" : "invisible"}`}
        />

        <p>{name}</p>

        <Icon
          name={`caret-${isExpanded ? "up" : "down"}`}
          className={`expander-icon`}
        />
      </div>

      <div>{isExpanded && <>{children}</>}</div>
    </div>
  );
}
