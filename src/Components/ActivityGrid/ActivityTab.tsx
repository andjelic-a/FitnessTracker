import { memo, useEffect, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import ActivityItems from "./ActivityItems";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import Async from "../Async/Async";

type ActivityTabProps = {
  year: number | "latest";
  data: Promise<Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]>;
};

const ActivityTab = memo<ActivityTabProps>(({ year, data }) => {
  const [completedWorkoutsCount, setCompletedWorkoutsCount] = useState(0);
  useEffect(() => {
    data.then((x) =>
      setCompletedWorkoutsCount(
        x.reduce((total, current) => total + current.completedCount, 0)
      )
    );
  }, [data]);

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
        <Async
          await={data}
          skeleton={<ActivityItems streak={null} year={year} />}
        >
          {(x) => <ActivityItems streak={x} year={year} />}
        </Async>
      </OverlayScrollbarsComponent>
    </>
  );
});

export default ActivityTab;
