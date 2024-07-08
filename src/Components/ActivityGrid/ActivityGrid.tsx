import { useState } from "react";
import Icon from "../Icon/Icon";
import "./ActivityGrid.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";

type ActivityGrid = {
  activity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[];
};

function ActivityGrid({ activity }: ActivityGrid) {
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);

  const getFillClass = (count: number) => {
    if (count > 7) return "fill-red";
    return `fill-${count}`;
  };

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
              weekOfActivity.completedCount
            )}`}
            onMouseEnter={() => setHoveredWeek(weekOfActivity.startDate)}
            onMouseLeave={() => setHoveredWeek(null)}
            key={weekOfActivity.startDate}
          >
            <Icon name="dumbbell" className="activity-icon" />
            {hoveredWeek === weekOfActivity.startDate && (
              <div className="popup">
                Completed {weekOfActivity.completedCount} workouts between&nbsp;
                {startOfWeek.toLocaleDateString("default", {
                  month: "long",
                  day: "numeric",
                })}
                &nbsp;and&nbsp;
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
