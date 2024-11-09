import { useEffect, useMemo, useState } from "react";
import "./ActivityGrid.scss";
import "overlayscrollbars/overlayscrollbars.css";
import ActivityTab from "./ActivityTab";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../Data/SendAPIRequest";

type ActivityGrid = {
  username?: string;
  joinedAt: Date;
};

function ActivityGrid({ username, joinedAt }: ActivityGrid) {
  const [showing, setShowing] = useState<"latest" | number>("latest");

  function getYears(): number[] {
    const years = new Set<number>();
    for (let i = joinedAt.getFullYear(); i <= new Date().getFullYear(); i++)
      years.add(i);

    return Array.from(years);
  }

  function getYearOptions(): ("latest" | number)[] {
    return ["latest", ...getYears().reverse()];
  }

  const activityTabNames = useMemo(() => getYearOptions(), [joinedAt]);

  const [tabData, setTabData] = useState<
    | {
        [key in "latest" | number]: Promise<
          Schema<"SimpleWeekOfCompletedWorkoutsResponseDTO">[]
        > | null;
      }
    | null
  >(null);

  useEffect(() => {
    setTabData((prev) => {
      const newTabData = {} as any;

      activityTabNames.forEach((tabName) => {
        newTabData[tabName] = prev?.[tabName] ?? null;
      });
      console.log('a');

      newTabData.latest ??= sendAPIRequest(
        `/api/user/${username ? "{username}" : "me"}/streak`,
        {
          method: "get",
          parameters: {
            username: username!,
          },
        }
      ).then((x) => (x.code === "OK" ? x.content : []));
      return newTabData;
    });
  }, [activityTabNames]);

  function handleSetShowing(option: number | "latest") {
    if (!tabData) return;

    if (tabData[option]) {
      tabData[option].then(() => void setShowing(option));
      return;
    }

    const response = sendAPIRequest(
      `/api/user/${username ? "{username}" : "me"}/streak`,
      {
        method: "get",
        parameters: {
          year: option === "latest" ? undefined : option,
          username,
        },
      }
    )
      .then((x) => (x.code === "OK" ? x.content : []))
      .then((x) => {
        setShowing(option);
        return x;
      });

    setTabData((prev) => {
      prev![option] = response;
      return prev;
    });
  }

  return (
    <div className="activity-grid-container">
      <>
        {tabData && tabData[showing] && (
          <ActivityTab year={showing} key={showing} data={tabData[showing]} />
        )}

        <div className="year-options-sidebar">
          {activityTabNames.map((option) => (
            <button
              className={"option" + (option === showing ? " selected" : "")}
              key={option}
              onClick={() => handleSetShowing(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </>
    </div>
  );
}

export default ActivityGrid;
