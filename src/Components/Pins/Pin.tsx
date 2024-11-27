import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getURLNameParam } from "../../Utility/FormatURLNameParam";

type PinProps = {
  pin: Schema<"PinResponseDTO">;
  includeDragHandle: boolean;
};

export default function Pin({ pin, includeDragHandle }: PinProps) {
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
      ref={includeDragHandle ? setNodeRef : undefined}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="pin-header">
        <Link
          to={`${pin.type === 0 ? "workout" : "split"}/${getURLNameParam(
            pin.name
          )}`}
        >
          <h3>{pin.name}</h3>
          &nbsp;
          <p className="pin-type">{pin.type === 0 ? "(Workout)" : "(Split)"}</p>
        </Link>
      </div>

      <div className="pin-description">{pin.description}</div>

      <div className="pin-footer">
        <div className="pin-likes">
          <Icon name="thumbs-up" />
          {pin.likeCount}
        </div>
        <div className="pin-favorites">
          <Icon name="bookmark" />
          {pin.favoriteCount}
        </div>
      </div>

      {includeDragHandle && (
        <button className="drag-handle" {...listeners} {...attributes}>
          <Icon name="grip-vertical" />

          <p className="accessibility-only" aria-hidden={false}>
            Drag to reorder
          </p>
        </button>
      )}
    </div>
  );
}
