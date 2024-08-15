import { useEffect, useState } from "react";
import Icon from "../Icon/Icon";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import Async from "../Async/Async";
import { addDays, getStartOfWeek } from "../../Utility/DateUtils";
import "./ActivityGrid.scss";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Tooltip } from "react-tooltip";
import "overlayscrollbars/overlayscrollbars.css";

type ActivityGrid = {
  latestActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[];
  joinedAt: Date;
  userId: string;
};

function ActivityGrid({ latestActivity, joinedAt, userId }: ActivityGrid) {
  const [showing, setShowing] = useState<"latest" | number>("latest");
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState<Promise<
    Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
  > | null>(null);

  function getFillClass(completed: number, total: number) {
    if (completed >= total) return "fill-red";
    return `fill-${completed}-of-${total}`;
  }

  async function getStreak(): Promise<
    Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
  > {
    if (showing === "latest") {
      const response = latestActivity;
      if (response.length >= 52) return response;

      let yearStart = getStartOfWeek(addDays(new Date(), -358));

      let newArray: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] = [];

      for (let curr = yearStart, i = 0; i < 52; curr = addDays(curr, 7), i++) {
        const currentIndexInResponse = response.findIndex(
          (x) => curr.toDateString() === new Date(x.startDate).toDateString()
        );

        newArray[i] =
          currentIndexInResponse >= 0
            ? response[currentIndexInResponse]
            : {
                startDate: curr.toUTCString(),
                completedCount: 0,
                totalCount: 7,
              };
      }

      return newArray;
    }

    return sendAPIRequest("/api/user/{userId}/streak", {
      method: "get",
      parameters: {
        year: showing,
        userId: userId,
      },
    }).then((x) => {
      const response = x.code === "OK" ? x.content : [];
      if (response.length >= 52) return response;

      let yearStart = getStartOfWeek(new Date(`${showing}-01-01`));
      if (yearStart < new Date(`${showing}-01-01`))
        yearStart = addDays(yearStart, 7);

      let newArray: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] = [];

      for (let curr = yearStart, i = 0; i < 52; curr = addDays(curr, 7), i++) {
        const currentIndexInResponse = response.findIndex(
          (x) => curr.toDateString() === new Date(x.startDate).toDateString()
        );

        newArray[i] =
          currentIndexInResponse >= 0
            ? response[currentIndexInResponse]
            : {
                startDate: curr.toUTCString(),
                completedCount: 0,
                totalCount: 7,
              };
      }

      return newArray;
    });
  }

  function getYears(): number[] {
    const years = new Set<number>();
    for (let i = joinedAt.getFullYear(); i <= new Date().getFullYear(); i++)
      years.add(i);

    return Array.from(years);
  }

  function getYearOptions(): ("latest" | number)[] {
    return ["latest", ...getYears().reverse()];
  }

  useEffect(
    () => void setCurrentlyDisplayed(getStreak()),
    [showing, latestActivity]
  );

  function getNumberOfWorkoutsInYear(
    streak: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
  ): number {
    return streak.reduce((total, week) => total + week.completedCount, 0);
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

  return (
    <div className="activity-grid-container">
      <Async await={currentlyDisplayed ?? getStreak()}>
        {(streak) => (
          <>
            <h3 className="activity-grid-header">
              <b>{getNumberOfWorkoutsInYear(streak)}</b> workouts completed in
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
              <div className="activity-grid-items">
                {streak.map(
                  (
                    weekOfActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">
                  ) => {
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
            </OverlayScrollbarsComponent>

            <div className="year-options-sidebar">
              {[...getYearOptions(), 123, 41, 76548, 4, 7, 2, 23, 432].map(
                (option) => (
                  <button
                    className={
                      "option" + (option === showing ? " selected" : "")
                    }
                    key={option}
                    onClick={() => void setShowing(option)}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </Async>
    </div>
  );
}

export default ActivityGrid;
