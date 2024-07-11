import { Suspense, useEffect, useState } from "react";
import Icon from "../Icon/Icon";
import "./ActivityGrid.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { Await } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";

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

  async function getStreak(): Promise<
    Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
  > {
    if (showing === "latest") {
      if (latestActivity.length >= 52) return latestActivity;

      const fill: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] = [];
      for (let i = latestActivity.length; i < 52; i++) {
        fill.push({
          startDate: addDays(
            new Date(latestActivity[0]?.startDate ?? new Date()),
            -i * 7
          ).toISOString(),
          completedCount: 0,
          totalCount: 7,
        });
      }

      return [...fill, ...latestActivity];
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

      let newArray: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] =
        new Array(53);

      for (let curr = yearStart, i = 0; i < 52; curr = addDays(curr, 7), i++) {
        const found = response.findIndex(
          (x) => curr.toDateString() === new Date(x.startDate).toDateString()
        );

        newArray[i] =
          found >= 0
            ? response[found]
            : {
                startDate: curr.toUTCString(),
                completedCount: 0,
                totalCount: 7,
              };
      }

      return newArray;
    });
  }

  function getStartOfWeek(date: Date): Date {
    const diff = (7 + (date.getDay() - 1)) % 7;
    return new Date(date.getTime() - diff * 24 * 60 * 60 * 1000);
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

  return (
    <div className="activity-grid-wrapper">
      <div className="activity-grid">
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={currentlyDisplayed ?? getStreak()}>
            {(streak: Awaited<ReturnType<typeof getStreak>>) =>
              streak.map((weekOfActivity) => {
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
                        {addDays(startOfWeek, 6).toLocaleDateString("default", {
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            }
          </Await>
        </Suspense>
      </div>

      {getYears().map((year) => (
        <p key={year} onClick={() => setShowing(year)}>
          {year}
        </p>
      ))}
    </div>
  );
}

export default ActivityGrid;
