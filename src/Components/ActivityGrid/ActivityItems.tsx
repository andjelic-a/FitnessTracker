import { Tooltip } from "react-tooltip";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { addDays, getStartOfWeek } from "../../Utility/DateUtils";
import Icon from "../Icon/Icon";
import { memo, useRef } from "react";

type ActivityItemsProps = {
  streak: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] | null;
  year: number | "latest";
};

const ActivityItems = memo<ActivityItemsProps>(({ streak, year }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  function getFillClass(completed: number, total: number) {
    if (completed >= total) return "fill-red";
    return `fill-${completed}-of-${total}`;
  }

  function getTooltipText(
    weekOfActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">
  ) {
    const startOfWeek = new Date(weekOfActivity.startDate);

    return formatDates(
      startOfWeek,
      addDays(startOfWeek, 6),
      weekOfActivity.completedCount
    );

    function formatDates(
      startDate: Date,
      endDate: Date,
      workoutCount: number
    ): string {
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };

      const start = startDate.toLocaleDateString("en-US", options);
      const end = endDate.toLocaleDateString("en-US", options);

      const startMonth = startDate.getMonth();
      const endMonth = endDate.getMonth();

      const dateRange =
        startMonth === endMonth
          ? `${start}-${end.split(" ")[1]}`
          : `${start}-${end}`;

      return `${workoutCount} workouts: ${dateRange}`;
    }
  }

  function getStreak(): Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] {
    if (!streak) return [];
    if (streak.length >= 52) return streak;

    let yearStart = getStartOfWeek(
      year === "latest" ? addDays(new Date(), -358) : new Date(`${year}-01-01`)
    );

    if (year !== "latest" && yearStart < new Date(`${year}-01-01`))
      yearStart = addDays(yearStart, 7);

    let newArray: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] = [];

    for (let curr = yearStart, i = 0; i < 52; curr = addDays(curr, 7), i++) {
      const currentIndexInResponse = streak.findIndex(
        (x) => curr.toDateString() === new Date(x.startDate).toDateString()
      );

      newArray[i] =
        currentIndexInResponse >= 0
          ? streak[currentIndexInResponse]
          : {
              startDate: curr.toUTCString(),
              completedCount: 0,
              totalCount: 7,
            };
    }

    return newArray;
  }

  return (
    <div className="activity-grid-items">
      {getStreak().map(
        (
          weekOfActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">
        ) => {
          return (
            <div
              ref={containerRef}
              className={`activity-item ${getFillClass(
                weekOfActivity.completedCount,
                weekOfActivity.totalCount
              )}`}
              key={"activity-grid-item-" + weekOfActivity.startDate}
              data-tooltip-id={`tooltip-${weekOfActivity.startDate}`}
              data-tooltip-content={getTooltipText(weekOfActivity)}
              data-tooltip-place="top"
            >
              <p className="disabled">
                <Icon name="dumbbell" className="activity-icon" />
              </p>

              <Tooltip
                id={`tooltip-${weekOfActivity.startDate}`}
                style={{
                  zIndex: 9999,
                }}
              />
            </div>
          );
        }
      )}
    </div>
  );
});

export default ActivityItems;
