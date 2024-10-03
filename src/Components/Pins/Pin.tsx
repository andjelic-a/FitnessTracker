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
          <h3>{pin.name}</h3>
          &nbsp;
          <p className="pin-type">{pin.type === 0 ? "(Workout)" : "(Split)"}</p>
        </Link>
      </div>

      <div className="pin-description">{pin.description}</div>

      <div className="pin-footer">
        <div className="pin-likes">
          <Icon name="thumbs-up" />0
        </div>
        <div className="pin-favorites">
          <Icon name="bookmark" />0
        </div>
      </div>

      <button className="drag-handle" {...listeners} {...attributes}>
        <Icon name="grip-vertical" />

        <p className="accessibility-only" aria-hidden={false}>
          Drag to reorder
        </p>
      </button>
    </div>
  );
}
