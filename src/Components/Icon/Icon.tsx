import { DOMAttributes, HTMLAttributes } from "react";

interface IconProps
  extends DOMAttributes<HTMLElement>,
    HTMLAttributes<HTMLElement> {
  className?: string;
  id?: string;
  name: string;
}

export default function Icon({ name, className, ...attributes }: IconProps) {
  return <i className={`fa fa-${name} ${className}`} {...attributes}></i>;
}
