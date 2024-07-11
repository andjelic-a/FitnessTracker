import React, { useState, useRef } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import DropdownItem from "./DropdownItem";
import "./Dropdown.scss";

interface DropdownProps {
  children: React.ReactNode;
  className: string;
  placeholder: string;
}

export default function Dropdown({ className, placeholder, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(placeholder);

  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownMenuRef, () => {
    setIsOpen(false);
  });

  const handleItemClick = (placeholder: string) => {
    setValue(placeholder);
    setIsOpen(false);
    console.log(dropdownItems);
  };

  const dropdownItems = React.Children.toArray(children).filter(
    (child): child is React.ReactElement => {
      return React.isValidElement(child) && child.type === DropdownItem;
    }
  );

  return (
    <div ref={dropdownMenuRef} className={`${className} dropdown-menu${isOpen ? " rounded" : ""}`}>
      <div
        className="dropdown-button"
        onClick={() => {
          setIsOpen((prevState) => !prevState);
        }}
      >
        {value}
      </div>
      <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
        <div
          onClick={() => handleItemClick(placeholder)}
          className="dropdown-item"
        >
          {placeholder}
        </div>
        {dropdownItems.map((item, index) => (
            <div
            key={index}
            className="dropdown-item"
            onClick={(() => handleItemClick(item.props.children))}>
                {item.props.children}
            </div>
        ))}
      </div>
    </div>
  );
}
