import { useMemo } from "react";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import Icon from "../../Icon/Icon";
import { SetType } from "../../WorkoutSetCreator/WorkoutItem/WorkoutItem";

type WorkoutDisplaySetProps = {
  set: Schema<"DetailedSetResponseDTO">;
  index: number;
};

export default function WorkoutDisplaySet({
  set,
  index,
}: WorkoutDisplaySetProps) {
  function getIconByType() {
    if (type === "1") return <p className="set-icon">{index + 1}</p>;
    else return <Icon className="set-icon" name={type} />;
  }

  const type = useMemo<SetType>(
    () => ["1", "w", "d", "f"][set.type] as SetType,
    [set.type]
  );

  return (
    <div className="set" key={set.id}>
      <div>{getIconByType()}</div>

      <div>
        <p>{type === "1" ? set.riR : type === "w" ? "-" : "0"}</p>
      </div>

      <div>
        <p>
          {set.bottomRepRange === set.topRepRange
            ? set.bottomRepRange
            : `${set.bottomRepRange}-${set.topRepRange}`}
        </p>
      </div>
    </div>
  );
}
