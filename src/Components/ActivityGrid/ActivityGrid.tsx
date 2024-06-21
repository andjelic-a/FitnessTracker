import { useState } from "react";
import Icon from "../Icon/Icon";
import "./ActivityGrid.scss";

type Week = {
  id: number;
  workoutCount: number;
};

function ActivityGrid() {
  const [hoveredWeek, setHoveredWeek] = useState<null | number>(null);

  const activityData: Week[] = Array.from({ length: 53 }, (_, i) => ({
    id: i + 1,
    workoutCount: Math.floor(Math.random() * 10), // Temporarily generated number
  }));

  const getFillClass = (count: number) => {
    if (count > 7) return "fill-red";
    return `fill-${count}`;
  };

  return (
    <div className="activity-grid">
      {activityData.map((week) => (
        <div
          className={`activity-item ${getFillClass(week.workoutCount)}`}
          onMouseEnter={() => setHoveredWeek(week.id)}
          onMouseLeave={() => setHoveredWeek(null)}
          key={week.id}
        >
          <Icon name="dumbbell" className="activity-icon" />
          {hoveredWeek === week.id && (
            <div className="popup">Workouts: {week.workoutCount}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ActivityGrid;