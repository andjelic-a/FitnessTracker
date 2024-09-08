import "./Profile.scss";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import AnimatedOutlet from "../../Components/WindowWrapper/AnimatedOutlet";
import ProfileSkeleton from "./Skeletons/ProfileSkeleton";
import profileLoader from "./ProfileLoader";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import Async from "../../Components/Async/Async";
import ProfileWorkoutTabs from "../../Components/ProfileWorkoutTabs/ProfileWorkoutTabs";
import { useState } from "react";
import { NewWorkoutsContext } from "../../Contexts/NewWorkoutsContext";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Pins from "../../Components/Pins/Pins";

export default function Profile() {
  const loaderData = useLoaderData<typeof profileLoader>();

  const [newWorkouts, setNewWorkouts] = useState<
    Schema<"SimpleWorkoutResponseDTO">[]
  >([]);

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
        <Async await={loaderData.user} skeleton={<ProfileSkeleton />}>
          {(loadedUserData: Awaited<typeof loaderData.user>) => {
            if (loadedUserData.code !== "OK") return null;

            return (
              <>
                <ProfileHeader user={loadedUserData.content} />

                <div className="profile-body">
                  <Async await={loaderData.pins}>
                    {(pins) => {
                      if (pins.code !== "OK") return null;

                      return <Pins pins={pins.content} />;
                    }}
                  </Async>

                  <ProfileWorkoutTabs
                    latestActivity={loaderData.latestWeekOfActivity.then(
                      (x) => (x.code === "OK" ? x.content : null)!
                    )}
                    split={loaderData.user.then((x) =>
                      x.code === "OK" ? x.content.currentSplit : null
                    )}
                  />

                  <Async
                    await={loaderData.streak}
                    skeleton={<ProfileSkeleton />}
                  >
                    {(loadedStreakData) => {
                      if (loadedStreakData.code !== "OK") return null;

                      return (
                        <>
                          <ActivityGrid
                            joinedAt={new Date(loadedUserData.content.joinedAt)}
                          />
                        </>
                      );
                    }}
                  </Async>
                </div>
              </>
            );
          }}
        </Async>
      </div>
    </NewWorkoutsContext.Provider>
  );
}
