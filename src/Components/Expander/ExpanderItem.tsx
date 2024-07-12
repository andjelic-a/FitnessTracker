export type ExpanderItemProps = {
  children: string;
};

export default function ExpanderItem({ children }: ExpanderItemProps) {
  return <div>{children}</div>;
}
