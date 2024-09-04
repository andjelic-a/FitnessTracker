import { Schema } from "../../Types/Endpoints/SchemaParser";
import Pin from "./Pin";
import "./Pins.scss";

type PinsProps = {
  pins: Schema<"SimplePinResponseDTO">[];
};

export default function Pins({ pins }: PinsProps) {
  return (
    <div className="pins-container">
      <div className="pins-header">
        <h1>Pins</h1>
        <button>Customize your pins</button>
      </div>

      {pins.map((x) => (
        <Pin key={x.id} pin={x} />
      ))}
    </div>
  );
}
