import { useDroppable } from "@dnd-kit/core";
import React from "react";

type DroppableProps = {
  id: string;
  children?: React.ReactNode;
};

export default function Droppable({ id, children }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div className="droppable" ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}
