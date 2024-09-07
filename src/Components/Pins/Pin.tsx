import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type PinProps = {
  pin: Schema<"PinResponseDTO">;
};

export default function Pin({ pin }: PinProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: pin.id,
    data: {
      type: "Pin",
      pin,
    },
  });

  return (
    <div
      className="pin-container"
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="pin-header">
        <Link to={`/${pin.type === 0 ? "workout" : "split"}/${pin.id}`}>
          <Icon
            className="pin-type-marker"
            name={pin.type === 0 ? "dumbbell" : "calendar-week"}
          />

          <p>{pin.name}</p>
        </Link>

        <button className="drag-handle" {...listeners} {...attributes}>
          <Icon name="grip-vertical" />

          <p className="accessibility-only" aria-hidden={false}>
            Drag to reorder
          </p>
        </button>
      </div>

      {pin.description.length > 0 && (
        <div className="pin-description">
          {pin.description.length > 150
            ? pin.description.slice(0, 75) + "..."
            : pin.description}
        </div>
      )}
    </div>
  );
}
