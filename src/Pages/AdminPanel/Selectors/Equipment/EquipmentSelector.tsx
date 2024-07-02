import "./EquipmentSelector.scss";
import { useEffect, useState } from "react";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";

type EquipmentSelectorProps = {
  selectedOnStart: number[];
  equipment: Schema<"SimpleEquipmentResponseDTO">[];
  onSelectionChanged: (selectedEquipmentIds: number[]) => void;
};

export default function EquipmentSelector({
  equipment,
  onSelectionChanged,
  selectedOnStart,
}: EquipmentSelectorProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<
    Schema<"SimpleEquipmentResponseDTO">[]
  >([]);

  useEffect(() => {
    setSelectedEquipment(
      equipment.filter((x) => selectedOnStart.includes(x.id))
    );
  }, [equipment, selectedOnStart]);

  useEffect(
    () => onSelectionChanged(selectedEquipment.map((x) => x.id)),
    [selectedEquipment]
  );

  function selectEquipment(
    toggleEquipment: Schema<"SimpleEquipmentResponseDTO">
  ) {
    setSelectedEquipment((equipment) => {
      if (equipment.some((x) => x.id === toggleEquipment.id)) {
        return equipment.filter((x) => x.id !== toggleEquipment.id);
      } else {
        return [...equipment, toggleEquipment];
      }
    });
  }

  return (
    <div className="new-exercise-equipment-selection">
      <h1>Equipment</h1>
      {equipment.map((x) => (
        <div
          key={"equipment-" + x.id}
          className={
            selectedEquipment.some((y) => y.id === x.id)
              ? "equipment option selected"
              : "equipment option"
          }
          onClick={() => selectEquipment(x)}
        >
          <p>{x.name}</p>
        </div>
      ))}
    </div>
  );
}
