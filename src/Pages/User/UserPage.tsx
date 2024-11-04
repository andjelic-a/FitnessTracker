import "./User.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import userLoader from "./UserLoader";
import { LoaderReturnType } from "../../BetterRouter/CreateLoader";
import { useEffect, useState } from "react";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import ProfileWorkoutTabs from "../../Components/ProfileWorkoutTabs/ProfileWorkoutTabs";
import Pins from "../../Components/Pins/Pins";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";

export default function UserPage() {
  const loaderData = useLoaderData<typeof userLoader>();

  const [loaderDataState, setLoaderDataState] = useState<
    | {
        [key in keyof LoaderReturnType<typeof userLoader>]: Awaited<
          LoaderReturnType<typeof userLoader>[key]
        >;
      }
    | null
  >(null);

  useEffect(() => {
    if (!loaderData) return;

    Promise.all([
      loaderData.user,
      loaderData.pins,
      loaderData.latestWeekOfActivity,
      loaderData.streak,
    ]).then((x) => {
      setLoaderDataState({
        user: x[0],
        pins: x[1],
        latestWeekOfActivity: x[2],
        streak: x[3],
      });
    });
  }, [loaderData]);

  return (
    <div className="profile">
      <InnerProfile loaderDataState={loaderDataState} />
    </div>
  );
}

function InnerProfile({
  loaderDataState,
}: {
  loaderDataState:
    | {
        [key in keyof LoaderReturnType<typeof userLoader>]: Awaited<
          LoaderReturnType<typeof userLoader>[key]
        >;
      }
    | null;
}) {
  if (loaderDataState?.user.code !== "OK") return <></>;

  return (
    <>
      <ProfileHeader user={loaderDataState.user.content} />

      <div className="profile-body">
        {loaderDataState.pins.code === "OK" && (
          <Pins pins={loaderDataState.pins.content} />
        )}

        <ProfileWorkoutTabs
          latestActivity={
            loaderDataState.latestWeekOfActivity.code === "OK"
              ? loaderDataState.latestWeekOfActivity.content
              : null
          }
          split={loaderDataState.user.content.currentSplit}
        />

        {loaderDataState.user.code === "OK" && (
          <ActivityGrid
            username={loaderDataState.user.content.username}
            joinedAt={new Date(loaderDataState.user.content.joinedAt)}
          />
        )}
      </div>
    </>
  );
}
