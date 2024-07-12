import "./Dropdown.scss";

interface DropdownItemProps {
  children: React.ReactNode;
}

export default function DropdownItem({ children }: DropdownItemProps) {
  return (
    <div>
      {children}
    </div>
  );
}