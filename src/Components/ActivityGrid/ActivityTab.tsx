import { memo, useEffect, useMemo, useRef, useState } from "react";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import ActivityItems from "./ActivityItems";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

type ActivityTabProps = {
  year: number | "latest";
};

const ActivityTab = memo<ActivityTabProps>(({ year }) => {
  const promiseRef = useRef<Promise<any> | null>(null);
  const [activity, setActivity] = useState<
    Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] | null
  >(null);

  useEffect(() => {
    if (promiseRef.current) return;

    promiseRef.current = sendAPIRequest("/api/user/me/streak", {
      method: "get",
      parameters: {
        year: year === "latest" ? undefined : year,
      },
    }).then((x) => {
      if (x.code === "Too Many Requests") promiseRef.current = null;
      if (x.code === "OK") setActivity(x.content);
    });
  }, [year]);

  const tabItems = useMemo(
    () => <ActivityItems streak={activity} year={year} />,
    [activity]
  );

  const completedWorkoutsCount = useMemo(
    () =>
      activity
        ? activity.reduce((total, current) => total + current.completedCount, 0)
        : 0,
    [activity]
  );

  return (
    <>
      <h3 className="activity-grid-header">
        <b>{completedWorkoutsCount}</b> workouts completed in
        {year === "latest" ? " the last year" : ` ${year}`}
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
        {tabItems}
      </OverlayScrollbarsComponent>
    </>
  );
});

export default ActivityTab;
