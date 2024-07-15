import "./ActivityGrid.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";

export default function ActivityGridSkeleton() {
  function getFillClass(completed: number, total: number) {
    if (completed >= total) return "fill-red";
    return `fill-${completed}-of-${total}`;
  }

  function addDays(date: Date, days: number) {
    const newDate = new Date(date.valueOf());
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  function getStartOfWeek(date: Date): Date {
    const diff = (7 + (date.getDay() - 1)) % 7;
    return new Date(date.getTime() - diff * 24 * 60 * 60 * 1000);
  }

  function getStreak(): Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] {
    let yearStart = getStartOfWeek(addDays(new Date(), -358));
    let newArray: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] = [];

    for (let curr = yearStart, i = 0; i < 52; curr = addDays(curr, 7), i++) {
      newArray[i] = {
        startDate: curr.toUTCString(),
        completedCount: 0 /* Math.floor(Math.random() * 7) */,
        totalCount: 7,
      };
    }

    return newArray;
  }

  return (
    <div
      className="activity-grid"
      style={{
        filter: "blur(2px)",
      }}
    >
      {getStreak().map((weekOfActivity) => (
        <div
          className={`activity-item ${getFillClass(
            weekOfActivity.completedCount,
            weekOfActivity.totalCount
          )}`}
          key={weekOfActivity.startDate}
        >
          <Icon name="dumbbell" className="activity-icon" />
        </div>
      ))}
    </div>
  );
}
