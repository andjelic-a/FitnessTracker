import { InputHTMLAttributes, RefObject, useState } from "react";
import "./InputField.scss";
import Icon from "../Icon/Icon";

interface InputFieldProps {
  placeholder?: string;
  onEnter?: (enteredText: string) => void;
  iconName?: string | null | undefined;
  className?: string;
  id?: string;
  inputRef?: RefObject<HTMLInputElement>;
  containerRef?: RefObject<HTMLDivElement>;
}

export default function InputField({
  onEnter,
  iconName,
  placeholder,
  className,
  id,
  name,
  onChange,
  onKeyDown,
  inputRef,
  containerRef,
  ...eventHandlers
}: InputFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const [enteredText, setEnteredText] = useState<string>("");

  function renderIcon() {
    return iconName ? <Icon className="icon" name={iconName} /> : null;
  }

  return (
    <div
      ref={containerRef}
      className={`input-field` + (className ? ` ${className}` : "")}
      id={id}
    >
      {renderIcon()}

      <div>
        <input
          name={id ?? name ?? "input-field" + Math.random().toString()}
          type="text"
          placeholder={placeholder}
          onChange={(e) => {
            setEnteredText(e.target.value);
            onChange?.(e);
          }}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEnter?.(enteredText);

            onKeyDown?.(e);
          }}
          {...eventHandlers}
        />
      </div>
    </div>
  );
}
