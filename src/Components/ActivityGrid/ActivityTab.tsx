import { memo, useEffect, useMemo, useRef, useState } from "react";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import ActivityItems from "./ActivityItems";

type ActivityTabProps = {
  year: number | "latest";
};

const ActivityTab = memo<ActivityTabProps>(({ year }) => {
  const promiseRef = useRef<Promise<any> | null>(null);
  const [activity, setActivity] = useState<
    Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[] | null
  >(null);

  console.log("rerendering activity tab", year);

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

  return <>{tabItems}</>;
});

export default ActivityTab;
