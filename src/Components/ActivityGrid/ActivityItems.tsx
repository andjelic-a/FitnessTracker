import { Tooltip } from "react-tooltip";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { addDays, getStartOfWeek } from "../../Utility/DateUtils";
import Icon from "../Icon/Icon";
import { memo, useCallback, useMemo } from "react";

type ActivityItemsProps = {
  streak: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] | null;
  year: number | "latest";
};

const ActivityItems = memo<ActivityItemsProps>(({ streak, year }) => {
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

  const getProcessedStreak =
    useCallback((): Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] => {
      if (!streak) return [];

      if (streak.length >= 52) return streak;

      let yearStart = getStartOfWeek(
        year === "latest"
          ? addDays(new Date(), -358)
          : new Date(`${year}-01-01`)
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
    }, [streak, year]);

  const processedStreak = useMemo(getProcessedStreak, [getProcessedStreak]);

  const emptyStreak = useMemo(() => new Array(52).fill({}), []);

  return (
    <div className="activity-grid-items">
      {processedStreak.length === 0
        ? emptyStreak.map((_, i) => {
            return (
              <div className="activity-item" key={"activity-grid-item-" + i}>
                <Icon name="dumbbell" className="activity-icon" />
              </div>
            );
          })
        : processedStreak.map((weekOfActivity) => {
            return (
              <div
                className={`activity-item ${getFillClass(
                  weekOfActivity.completedCount,
                  weekOfActivity.totalCount
                )}`}
                key={"activity-grid-item-" + weekOfActivity.startDate}
                data-tooltip-id={`tooltip-${weekOfActivity.startDate}`}
                data-tooltip-content={getTooltipText(weekOfActivity)}
                data-tooltip-place="top"
                data-tooltip-position-strategy="fixed"
              >
                <Icon name="dumbbell" className="activity-icon" />

                <Tooltip
                  id={`tooltip-${weekOfActivity.startDate}`}
                  style={{
                    zIndex: 9999,
                  }}
                />
              </div>
            );
          })}
    </div>
  );
});

export default ActivityItems;
