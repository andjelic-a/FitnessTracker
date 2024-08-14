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

  useEffect(
    () => void setCurrentlyDisplayed(getStreak()),
    [showing, latestActivity]
  );

  const handlePreviousClick = (years: number[]) => {
    if (showing === "latest") setShowing(years[years.length - 1]);
    else if (showing === years[0]) setShowing("latest");
    else setShowing(showing - 1);
  };

  const handleNextClick = (years: number[]) => {
    if (showing === "latest") setShowing(years[0]);
    else if (showing === years[years.length - 1]) setShowing("latest");
    else setShowing(showing + 1);
  };

  function getNumberOfWorkoutsInYear(
    streak: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
  ): number {
    return streak.reduce((total, week) => total + week.completedCount, 0);
  }

  function getTooltipText(
    weekOfActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">
  ) {
    const startOfWeek = new Date(weekOfActivity.startDate);

    return `Completed ${
      weekOfActivity.completedCount
    } workouts from ${startOfWeek.toLocaleDateString("default", {
      month: "long",
      day: "numeric",
    })} to ${addDays(startOfWeek, 6).toLocaleDateString("default", {
      month: "long",
      day: "numeric",
    })}
`;
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
                  y: "scroll",
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
                        key={weekOfActivity.startDate}
                      >
                        <p
                          className="disabled"
                          data-tooltip-id={`tooltip-${weekOfActivity.startDate}`}
                          data-tooltip-content={getTooltipText(weekOfActivity)}
                          data-tooltip-place="top"
                        >
                          <Icon name="dumbbell" className="activity-icon" />
                        </p>

                        <Tooltip
                          id={`tooltip-${weekOfActivity.startDate}`}
                          style={{
                            zIndex: 9999,
                          }}
                        />

                        {/*                         {hoveredWeek === weekOfActivity.startDate && (
                          <div className="popup">
                            Completed {weekOfActivity.completedCount} workouts
                            from&nbsp;
                            {startOfWeek.toLocaleDateString("default", {
                              month: "long",
                              day: "numeric",
                            })}
                            &nbsp;to&nbsp;
                            {addDays(startOfWeek, 6).toLocaleDateString(
                              "default",
                              {
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        )} */}
                      </div>
                    );
                  }
                )}
              </div>
            </OverlayScrollbarsComponent>

            <div className="activity-grid-footer">
              <Icon
                onClick={() => handlePreviousClick(getYears())}
                className="caret-icon"
                name="caret-left"
              />

              <p>{showing}</p>

              <Icon
                onClick={() => handleNextClick(getYears())}
                className="caret-icon"
                name="caret-right"
              />
            </div>
          </>
        )}
      </Async>
    </div>
  );
}

export default ActivityGrid;
