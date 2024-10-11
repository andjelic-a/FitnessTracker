import { memo, useMemo } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import ActivityItems from "./ActivityItems";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import Async from "../Async/Async";

type ActivityTabProps = {
  year: number | "latest";
  data: Promise<Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]>;
};

const ActivityTab = memo<ActivityTabProps>(({ year, data }) => {
  const tabItems = useMemo(
    () => (
      <Async await={data}>
        {(x) => <ActivityItems streak={x} year={year} />}
      </Async>
    ),
    [data]
  );

  /*   const completedWorkoutsCount = useMemo(
    () =>
      activity
        ? activity.reduce((total, current) => total + current.completedCount, 0)
        : 0,
    [activity]
  ); */

  return (
    <>
      <h3 className="activity-grid-header">
        <b>{/* completedWorkoutsCount */ 0}</b> workouts completed in
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
