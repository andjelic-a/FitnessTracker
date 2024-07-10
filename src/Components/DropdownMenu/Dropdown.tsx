import { useState } from "react";
import "./Dropdown.scss";

interface DropdownProps {
  className: string;
}

export default function Dropdown({ className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className={className + " dropdown-menu"}>
      <div
      className="dropdown-button"
        onClick={() => {
          setIsOpen((prevState) => !prevState);
        }}
      >
        {value ? value : "Placeholder"}
      </div>
      <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
        <div onClick={() => setValue("Item 1")} className="dropdown-item">Item 1</div>
        <div onClick={() => setValue("Item 2")} className="dropdown-item">Item 2</div>
        <div onClick={() => setValue("Item 3")} className="dropdown-item">Item 3</div>
      </div>
    </div>
  );
}
