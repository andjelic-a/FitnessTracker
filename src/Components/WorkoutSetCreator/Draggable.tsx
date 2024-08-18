import { useDraggable } from "@dnd-kit/core";

type DraggableProps = {
  id: string;
  children?: React.ReactNode;
};

export default function Draggable({ id, children }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button className="draggable" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
}
