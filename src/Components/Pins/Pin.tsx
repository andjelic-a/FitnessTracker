import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";

type PinProps = {
  pin: Schema<"SimplePinResponseDTO">;
};

export default function Pin({ pin }: PinProps) {
  return (
    <div className="pin-container">
      <div className="pin-header">
        <Link to={`/${pin.type === 0 ? "workout" : "split"}/${pin.id}`}>
          <Icon
            className="pin-type-marker"
            name={pin.type === 0 ? "dumbbell" : "calendar-week"}
          />

          <p>{pin.name}</p>
        </Link>

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
