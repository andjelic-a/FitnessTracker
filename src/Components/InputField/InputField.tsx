import { InputHTMLAttributes, useRef, useState } from "react";
import "./InputField.scss";
import Icon from "../Icon/Icon";

interface InputFieldProps {
  placeholder?: string;
  onEnter?: (enteredText: string) => boolean | undefined | null | void;
  iconName?: string | null | undefined;
  className?: string;
  id?: string;
}

export default function InputField({
  onEnter,
  iconName,
  placeholder,
  className,
  id,
  onChange,
  onKeyDown,
  ...eventHandlers
}: InputFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const inputField = useRef<HTMLInputElement>(null);
  const [enteredText, setEnteredText] = useState<string>("");

  function renderIcon() {
    return iconName ? <Icon className="icon" name={iconName} /> : null;
  }

  return (
    <div className={`input-field` + (className ? ` ${className}` : "")} id={id}>
      {renderIcon()}

      <div>
        <input
          name={id ?? "input-field" + Math.random().toString()}
          type="text"
          placeholder={placeholder}
          ref={inputField}
          onChange={(e) => {
            setEnteredText(e.target.value);
            onChange?.(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const answer = onEnter?.(enteredText);
              if (answer && inputField.current) inputField.current.value = "";
            }

            onKeyDown?.(e);
          }}
          {...eventHandlers}
        />
      </div>
    </div>
  );
}
