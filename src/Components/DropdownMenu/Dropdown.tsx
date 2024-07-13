import React, { useState, useRef, useEffect } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import DropdownItem from "./DropdownItem";
import "./Dropdown.scss";

interface DropdownProps {
  children: React.ReactNode;
  className: string;
  placeholder: string;
  onOpen?: () => void;
  openOnStart?: boolean;
}

export default function Dropdown({
  className,
  placeholder,
  children,
  onOpen,
  openOnStart,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(placeholder);

  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => void setIsOpen(openOnStart ?? false), [openOnStart]);

  useOutsideClick(dropdownMenuRef, () => void setIsOpen(false));

  const handleItemClick = (placeholder: string) => {
    setValue(placeholder);
    setIsOpen(false);
    console.log(dropdownItems);
  };

  const dropdownItems = React.Children.toArray(children).filter(
    (child): child is React.ReactElement =>
      React.isValidElement(child) && child.type === DropdownItem
  );

  return (
    <div
      ref={dropdownMenuRef}
      className={`${className} dropdown-menu${isOpen ? " rounded" : ""}`}
    >
      <div
        className="dropdown-button"
        onClick={() => {
          if (!isOpen) onOpen?.();
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
        {dropdownItems.map((item) => {
          const Item = item.type;

          return (
            <Item
              {...item.props}
              onClick={() => {
                item.props.onClick?.();
                handleItemClick(item.props.children);
              }}
              key={item.key}
            />
          );
        })}
      </div>
    </div>
  );
}
