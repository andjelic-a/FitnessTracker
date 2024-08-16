import { useMemo, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import "./ActivityGrid.scss";
import "overlayscrollbars/overlayscrollbars.css";
import ActivityTab from "./ActivityTab";

type ActivityGrid = {
  latestActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[];
  joinedAt: Date;
  userId: string;
};

function ActivityGrid({ joinedAt }: ActivityGrid) {
  const [showing, setShowing] = useState<"latest" | number>("latest");

  function getYears(): number[] {
    const years = new Set<number>();
    for (let i = joinedAt.getFullYear(); i <= new Date().getFullYear(); i++)
      years.add(i);

    return Array.from(years);
  }

  function getYearOptions(): ("latest" | number)[] {
    return ["latest", ...getYears().reverse()];
  }

  const activityTabNames = useMemo(() => getYearOptions(), [joinedAt]);

  return (
    <div className="activity-grid-container">
      <>
        <ActivityTab year={showing} key={showing} />

        <div className="year-options-sidebar">
          {activityTabNames.map((option) => (
            <button
              className={"option" + (option === showing ? " selected" : "")}
              key={option}
              onClick={() => void setShowing(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </>
    </div>
  );
}

export default ActivityGrid;
