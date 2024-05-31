import { InputHTMLAttributes, RefObject, useState } from "react";
import "./InputField.scss";
import Icon from "../Icon/Icon";

interface InputFieldProps {
  placeholder?: string;
  onEnter?: (enteredText: string) => void;
  iconName?: string | null | undefined;
  className?: string;
  id?: string;
  ref?: RefObject<HTMLInputElement>;
}

export default function InputField({
  onEnter,
  iconName,
  placeholder,
  className,
  id,
  onChange,
  onKeyDown,
  ref,
  ...eventHandlers
}: InputFieldProps & InputHTMLAttributes<HTMLInputElement>) {
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
          onChange={(e) => {
            setEnteredText(e.target.value);
            onChange?.(e);
          }}
          ref={ref}
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
