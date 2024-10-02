import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import "./Pins.scss";

type PinDragOverlayProps = {
  pin: Schema<"PinResponseDTO">;
};

export default function PinDragOverlay({ pin }: PinDragOverlayProps) {
  return (
    <div className="pin-container dragging" aria-hidden tabIndex={-1}>
      <div className="pin-header">
        <h3>{pin.name}</h3>
        &nbsp;&nbsp;
        <p className="pin-type">{pin.type === 0 ? "(Workout)" : "(Split)"}</p>
      </div>

      <div className="pin-description">
        {pin.description}
      </div>

      <div className="pin-footer">
        <div className="pin-likes">
          <Icon name="thumbs-up" />0
        </div>
        <div className="pin-favorites">
          <Icon name="bookmark" />0
        </div>
      </div>

      <button className="drag-handle">
        <Icon name="grip-vertical" />

        <p className="accessibility-only" aria-hidden={false}>
          Drag to reorder
        </p>
      </button>
    </div>
  );
}
