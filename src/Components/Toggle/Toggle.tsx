import { useEffect, useState } from "react";
import "./Toggle.scss";

type ToggleProps = {
  text: string;
  defaultValue?: boolean;
  onToggle?: (newValue: boolean) => void;
  className?: string;
};

export default function Toggle({
  text,
  defaultValue,
  onToggle,
  className,
}: ToggleProps) {
  const [isToggled, setIsToggled] = useState(false);
  useEffect(() => {
    setIsToggled(defaultValue ?? false);
    onToggle?.(defaultValue ?? false);
  }, [defaultValue]);

  function handleToggle() {
    setIsToggled(!isToggled);
    onToggle?.(!isToggled);
  }

  return (
    <button
      aria-selected={isToggled}
      role="checkbox"
      onClick={handleToggle}
      className={`toggle` + (className !== undefined ? ` ${className}` : "")}
      data-toggled={isToggled}
    >
      {text}
    </button>
  );
}
