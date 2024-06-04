import { InputHTMLAttributes, RefObject, useRef, useState } from "react";
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
  password?: boolean;
}

export default function InputField({
  onEnter,
  iconName,
  placeholder,
  className,
  id,
  name,
  onKeyDown,
  inputRef: inputRefProp,
  containerRef,
  password,
  ...eventHandlers
}: InputFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHidden, setIsHidden] = useState(password);

  function renderIcon() {
    return iconName ? <Icon className="icon" name={iconName} /> : null;
  }

  function renderPasswordIcon() {
    return password ? (
      <div className="password-icon-container">
        <Icon
          className="icon"
          name={isHidden ? "eye" : "eye-slash"}
          onClick={() => setIsHidden(!isHidden)}
        />
      </div>
    ) : null;
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
          type={isHidden ? "password" : "text"}
          placeholder={placeholder}
          ref={inputRefProp ?? inputRef}
          onKeyDown={(e) => {
            const input = inputRefProp
              ? inputRefProp.current
              : inputRef.current;
            if (!input) return;

            if (e.key === "Enter") onEnter?.(input.value);
            onKeyDown?.(e);
          }}
          {...eventHandlers}
        />
      </div>

      {renderPasswordIcon()}
    </div>
  );
}
