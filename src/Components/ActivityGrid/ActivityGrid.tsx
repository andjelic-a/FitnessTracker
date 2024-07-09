import { useState } from "react";
import Icon from "../Icon/Icon";
import "./ActivityGrid.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";

type ActivityGrid = {
  activity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[];
};

function ActivityGrid({ activity }: ActivityGrid) {
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);

  function getFillClass(completed: number, total: number) {
    if (completed >= total) return "fill-red";
    return `fill-${completed}-of-${total}`;
  }

  function addDays(date: Date, days: number) {
    const newDate = new Date(date.valueOf());
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  return (
    <div className="activity-grid">
      {activity.map((weekOfActivity) => {
        const startOfWeek = new Date(weekOfActivity.startDate);

        return (
          <div
            className={`activity-item ${getFillClass(
              weekOfActivity.completedCount,
              weekOfActivity.totalCount
            )}`}
            onMouseEnter={() => setHoveredWeek(weekOfActivity.startDate)}
            onMouseLeave={() => setHoveredWeek(null)}
            key={weekOfActivity.startDate}
          >
            <Icon name="dumbbell" className="activity-icon" />
            {hoveredWeek === weekOfActivity.startDate && (
              <div className="popup">
                Completed {weekOfActivity.completedCount} workouts from&nbsp;
                {startOfWeek.toLocaleDateString("default", {
                  month: "long",
                  day: "numeric",
                })}
                &nbsp;to&nbsp;
                {addDays(startOfWeek, 6).toLocaleDateString("default", {
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ActivityGrid;
