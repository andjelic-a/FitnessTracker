import { Suspense, useEffect, useState } from "react";
import Icon from "../Icon/Icon";
import "./ActivityGrid.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { Await } from "react-router-dom";

type ActivityGrid = {
  latestActivity: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[];
};

function ActivityGrid({ latestActivity }: ActivityGrid) {
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

    return [];
  }

  useEffect(
    () => void setCurrentlyDisplayed(getStreak()),
    [showing, latestActivity]
  );

  return (
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
                  onMouseEnter={() => setHoveredWeek(weekOfActivity.startDate)}
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
  );

  function reverseFill(
    array: Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
  ): Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] {
    return array;
  }
}

export default ActivityGrid;
