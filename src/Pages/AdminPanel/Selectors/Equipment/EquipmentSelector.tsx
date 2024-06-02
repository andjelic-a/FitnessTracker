import "./EquipmentSelector.scss";
import { useEffect, useState } from "react";
import Equipment from "../../../../Types/Models/Equipment";
import { Immutable, Narrow } from "../../../../Types/Utility/Models";

type EquipmentSelectorProps = {
  equipment: Immutable<Narrow<Equipment, ["id", "name"]>>[];
  onSelectionChanged: (selectedEquipmentIds: number[]) => void;
};

export default function EquipmentSelector({
  equipment: muscleGroups,
  onSelectionChanged,
}: EquipmentSelectorProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<
    Immutable<Narrow<Equipment, ["id", "name"]>>[]
  >([]);

  useEffect(
    () => onSelectionChanged(selectedEquipment.map((x) => x.id)),
    [selectedEquipment]
  );

  function selectEquipment(
    toggleEquipment: Immutable<Narrow<Equipment, ["id", "name"]>>
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
      {muscleGroups.map((x) => (
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
