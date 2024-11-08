import React, { useState, useRef, useEffect, useMemo } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import DropdownItem from "./DropdownItem";
import "./Dropdown.scss";

type UniversalDropdownProps = {
  className?: string;
  openOnStart?: boolean;
  onOpen?: () => void;
};

type DropdownProps = {
  children: React.ReactNode;
  placeholder: string;
  onSelectionChanged?: (key: string) => void;
} & UniversalDropdownProps;

type DropdownWithValuesProps<Values extends ValuesType> = {
  values: Values;
  defaultValue: keyof Values;
  onSelectionChanged?: (key: keyof Values, value: Values[keyof Values]) => void;
} & UniversalDropdownProps;

type ValuesType = {
  [key: string]: unknown;
};

export default function Dropdown(props: DropdownProps): React.JSX.Element;

export default function Dropdown<Values extends ValuesType>(
  props: DropdownWithValuesProps<Values>
): React.JSX.Element;

export default function Dropdown<Values extends ValuesType>(
  props: DropdownWithValuesProps<Values> | DropdownProps
): React.JSX.Element {
  if ("values" in props) return <ValueBasedDropdown {...props} />;
  else return <ChildBasedDropdown {...props} />;
}

function ChildBasedDropdown({
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
      className={`${className ? className : ""} dropdown-menu${
        isOpen ? " rounded" : ""
      }`}
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

function ValueBasedDropdown<Values extends ValuesType>({
  values,
  defaultValue,
  openOnStart,
  className,
  onOpen,
  onSelectionChanged,
}: DropdownWithValuesProps<Values>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(defaultValue?.toString() ?? "");

  useEffect(() => {
    setValue(defaultValue?.toString() ?? "");
    onSelectionChanged?.(defaultValue, values[defaultValue]);
  }, [defaultValue, values]);

  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => void setIsOpen(openOnStart ?? false), [openOnStart]);

  useOutsideClick(dropdownMenuRef, () => void setIsOpen(false));

  const items = useMemo(() => {
    const keys = Object.keys(values) as (keyof Values)[];

    return keys.map((key) => (
      <DropdownItem
        children={key.toString()}
        key={key.toString()}
        onClick={() => handleSelect(key)}
      />
    ));
  }, [values]);

  function handleSelect(selected: keyof Values) {
    onSelectionChanged?.(selected, values[selected]);
    setValue(selected.toString());
    setIsOpen(false);
  }

  return (
    <div
      ref={dropdownMenuRef}
      className={`${className ? className : ""} dropdown-menu${
        isOpen ? " rounded" : ""
      }`}
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
      <div className={`dropdown-content ${isOpen ? "open" : ""}`}>{items}</div>
    </div>
  );
}
