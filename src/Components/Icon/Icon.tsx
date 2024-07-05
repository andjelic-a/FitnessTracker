import { DOMAttributes, forwardRef, HTMLAttributes } from "react";

interface IconProps
  extends DOMAttributes<HTMLElement>,
    HTMLAttributes<HTMLElement> {
  className?: string;
  id?: string;
  name: string;
}

const Icon = forwardRef<HTMLElement, IconProps>(
  ({ name, className, ...attributes }, ref) => {
    return (
      <i className={`fa fa-${name} ${className}`} ref={ref} {...attributes}></i>
    );
  }
);

export default Icon;
