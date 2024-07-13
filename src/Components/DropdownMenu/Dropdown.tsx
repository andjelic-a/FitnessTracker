import React, { useState, useRef, useEffect, useMemo } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import DropdownItem from "./DropdownItem";
import "./Dropdown.scss";

interface DropdownProps {
  children: React.ReactNode;
  className: string;
  placeholder: string;
  onOpen?: () => void;
  openOnStart?: boolean;
  onSelectionChanged?: (key: string) => void;
}

export default function Dropdown({
  className,
  placeholder,
  children,
  onOpen,
  openOnStart,
  onSelectionChanged,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(placeholder);

  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => void setIsOpen(openOnStart ?? false), [openOnStart]);

  useOutsideClick(dropdownMenuRef, () => void setIsOpen(false));

  const handleItemClick = (placeholder: string, key: string | null) => {
    setValue(placeholder);
    setIsOpen(false);
    onSelectionChanged?.(key ?? "");
  };

  const dropdownItems = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child): child is React.ReactElement =>
          React.isValidElement(child) && child.type === DropdownItem
      ),
    [children]
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
          onClick={() => handleItemClick(placeholder, "-1")}
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
                handleItemClick(item.props.children, item.key);
              }}
              key={item.key}
            />
          );
        })}
      </div>
    </div>
  );
}
