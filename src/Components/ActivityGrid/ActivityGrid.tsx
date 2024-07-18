import { Suspense, useEffect, useState } from "react";
import Icon from "../Icon/Icon";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { Await } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import ActivityGridSkeleton from "./ActivityGridSkeleton";
import "./ActivityGrid.scss";

type ActivityGrid = {
  latestActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[];
  joinedAt: Date;
  userId: string;
};

function ActivityGrid({ latestActivity, joinedAt, userId }: ActivityGrid) {
  const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);
  const [showing, setShowing] = useState<"latest" | number>("latest");
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState<Promise<
    Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
  > | null>(null);

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
    if (showing === "latest") {
      setShowing(years[years.length - 1]);
    } else if (showing === years[0]) {
      setShowing("latest");
    } else {
      setShowing(showing - 1);
    }
  };

  const handleNextClick = (years: number[]) => {
    if (showing === "latest") {
      setShowing(years[0]);
    } else if (showing === years[years.length - 1]) {
      setShowing("latest");
    } else {
      setShowing(showing + 1);
    }
  };

  function getNumberOfWorkoutsInYear(streak: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]): number {
    return streak.reduce((total, week) => total + week.completedCount, 0);
  }

  return (
    <div className="activity-grid-wrapper">
      <Suspense fallback={<ActivityGridSkeleton />}>
        <Await resolve={currentlyDisplayed ?? getStreak()}>
          {(streak: Awaited<ReturnType<typeof getStreak>>) => (
            <>
              <h3 className="activity-grid-header">
                <b>{getNumberOfWorkoutsInYear(streak)}</b> workouts done in last year
              </h3>
              <div className="activity-grid">
                {streak.map(
                  (
                    weekOfActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">
                  ) => {
                    const startOfWeek = new Date(weekOfActivity.startDate);

                    return (
                      <div
                        className={`activity-item ${getFillClass(
                          weekOfActivity.completedCount,
                          weekOfActivity.totalCount
                        )}`}
                        onMouseEnter={() =>
                          setHoveredWeek(weekOfActivity.startDate)
                        }
                        onMouseLeave={() => setHoveredWeek(null)}
                        key={weekOfActivity.startDate}
                      >
                        <Icon name="dumbbell" className="activity-icon" />
                        {hoveredWeek === weekOfActivity.startDate && (
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
                        )}
                      </div>
                    );
                  }
                )}
              </div>
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
        </Await>
      </Suspense>
    </div>
  );
}

export default ActivityGrid;
