import "./Dropdown.scss";

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function DropdownItem({ children, onClick }: DropdownItemProps) {
  return (
    <button className="dropdown-item" onClick={onClick}>
      {children}
    </button>
  );
}
