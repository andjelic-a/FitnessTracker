import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import User from "../User/User";

type PinProps = {
  pin: Schema<"SimplePinResponseDTO">;
};

export default function Pin({ pin }: PinProps) {
  return (
    <div className="pin-container">
      <div className="pin-header">
        <Link to={`/${pin.type === 0 ? "workout" : "split"}/${pin.id}`}>
          {pin.name}
        </Link>

        <div className="pin-type-marker">
          {pin.type === 0 ? "Workout" : "Split"}
        </div>
      </div>

      <div className="pin-description">{pin.description}</div>

      <div className="pin-footer">
        <User user={pin.creator} />
      </div>
    </div>
  );
}
