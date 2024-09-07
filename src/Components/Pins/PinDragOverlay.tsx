import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";

type PinDragOverlayProps = {
  pin: Schema<"PinResponseDTO">;
};

export default function PinDragOverlay({ pin }: PinDragOverlayProps) {
  return (
    <div className="pin-container" aria-hidden tabIndex={-1}>
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
