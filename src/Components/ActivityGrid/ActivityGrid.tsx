import { useMemo, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import "./ActivityGrid.scss";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import ActivityTab from "./ActivityTab";

type ActivityGrid = {
  latestActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[];
  joinedAt: Date;
  userId: string;
};

function ActivityGrid({ joinedAt }: ActivityGrid) {
  const [showing, setShowing] = useState<"latest" | number>("latest");

  console.log("rerender activity grid");

  function getYears(): number[] {
    const years = new Set<number>();
    for (let i = joinedAt.getFullYear(); i <= new Date().getFullYear(); i++)
      years.add(i);

    return Array.from(years);
  }

  function getYearOptions(): ("latest" | number)[] {
    return ["latest", ...getYears().reverse()];
  }

  /*   function getNumberOfWorkoutsInYear(
    streak: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
  ): number {
    return streak.reduce((total, week) => total + week.completedCount, 0);
  } */

  const activityTabNames = useMemo(() => getYearOptions(), [joinedAt]);

  return (
    <div className="activity-grid-container">
      <>
        <h3 className="activity-grid-header">
          {/* <b>{getNumberOfWorkoutsInYear(streak)}</b> workouts completed in */}
          {showing === "latest" ? " the last year" : ` ${showing}`}
        </h3>

        <OverlayScrollbarsComponent
          className="activity-grid-body"
          options={{
            scrollbars: {
              autoHide: "leave",
              autoHideDelay: 100,
              theme: "os-theme-light",
            },
            overflow: {
              x: "scroll",
              y: "hidden",
            },
          }}
        >
          <ActivityTab key={showing} year={showing} />
        </OverlayScrollbarsComponent>

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
