import "./Profile.scss";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import AnimatedOutlet from "../../Components/WindowWrapper/AnimatedOutlet";
import profileLoader from "./ProfileLoader";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import ProfileTabs from "../../Components/ProfileTabs/ProfileTabs";
import { useEffect, useState } from "react";
import { NewWorkoutsContext } from "../../Contexts/NewWorkoutsContext";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Pins from "../../Components/Pins/Pins";
import { LoaderReturnType } from "../../BetterRouter/CreateLoader";

export default function Profile() {
  const loaderData = useLoaderData<typeof profileLoader>();

  const [newWorkouts, setNewWorkouts] = useState<
    Schema<"SimpleWorkoutResponseDTO">[]
  >([]);

  const [loaderDataState, setLoaderDataState] = useState<
    | {
        [key in keyof LoaderReturnType<typeof profileLoader>]: Awaited<
          LoaderReturnType<typeof profileLoader>[key]
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
    <NewWorkoutsContext.Provider
      value={{
        createdWorkouts: newWorkouts,
        addWorkout: (workout) =>
          void setNewWorkouts((prev) => [...prev, workout]),
      }}
    >
      <AnimatedOutlet />

      <div className="profile">
        <InnerProfile loaderDataState={loaderDataState} />
      </div>
    </NewWorkoutsContext.Provider>
  );
}

function InnerProfile({
  loaderDataState,
}: {
  loaderDataState:
    | {
        [key in keyof LoaderReturnType<typeof profileLoader>]: Awaited<
          LoaderReturnType<typeof profileLoader>[key]
        >;
      }
    | null;
}) {
  if (loaderDataState?.user.code !== "OK") return <></>;

  return (
    <>
      <ProfileHeader includeEditButton user={loaderDataState.user.content} />

      <div className="profile-body">
        {loaderDataState.pins.code === "OK" && (
          <Pins pins={loaderDataState.pins.content} includeEditButtons />
        )}

        <ProfileTabs
          latestActivity={
            loaderDataState.latestWeekOfActivity.code === "OK"
              ? loaderDataState.latestWeekOfActivity.content
              : null
          }
          split={loaderDataState.user.content.currentSplit}
        />

        {loaderDataState.user.code === "OK" && (
          <ActivityGrid
            joinedAt={new Date(loaderDataState.user.content.joinedAt)}
          />
        )}
      </div>
    </>
  );
}
