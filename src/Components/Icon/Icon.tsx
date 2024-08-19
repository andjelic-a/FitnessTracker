import { forwardRef } from "react";
import { HTMLProps } from "../../Types/Utility/HTMLProps";

type IconProps = {
  className?: string;
  id?: string;
  name: string;
} & HTMLProps<HTMLElement>;

const Icon = forwardRef<HTMLElement, IconProps>(
  ({ name, className, ...attributes }, ref) => {
    return (
      <i
        className={`fa fa-${name}${className ? " " + className : ""}`}
        ref={ref}
        {...attributes}
      ></i>
    );
  }
);

export default Icon;
