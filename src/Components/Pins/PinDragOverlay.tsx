import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";

type PinDragOverlayProps = {
  pin: Schema<"PinResponseDTO">;
};

export default function PinDragOverlay({ pin }: PinDragOverlayProps) {
  return (
    <div className="pin-container dragging" aria-hidden tabIndex={-1}>
      <div className="pin-header">
        <a aria-disabled>
          <Icon
            className="pin-type-marker"
            name={pin.type === 0 ? "dumbbell" : "calendar-week"}
          />

          <p>{pin.name}</p>
        </a>

        <button className="drag-handle">
          <Icon name="grip-vertical" />
        </button>
      </div>
    </div>
  );
}
