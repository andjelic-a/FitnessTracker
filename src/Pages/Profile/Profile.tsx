import "./Profile.scss";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import { useNavigate } from "react-router-dom";
import AnimatedOutlet from "../../Components/WindowWrapper/AnimatedOutlet";
import ProfileSkeleton from "./Skeletons/ProfileSkeleton";
import profileLoader from "./ProfileLoader";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import Async from "../../Components/Async/Async";
import ProfileWorkoutTabs from "../../Components/ProfileWorkoutTabs/ProfileWorkoutTabs";
import LazyLoadingContainer from "../../Components/LazyLoadingContainer/LazyLoadingContainer";
import WorkoutCarousel from "../../Components/WorkoutCarousel/WorkoutCarousel";
import { useMemo, useState } from "react";
import { NewWorkoutsContext } from "../../Components/WorkoutsContainer/CreateRoutine/NewWorkoutsContext";
import { Schema } from "../../Types/Endpoints/SchemaParser";

export default function Profile() {
  const loaderData = useLoaderData<typeof profileLoader>();

  const navigate = useNavigate();

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
      <div className="profile">
        <AnimatedOutlet />

        <Async await={loaderData.user} skeleton={<ProfileSkeleton />}>
          {(loadedUserData: Awaited<typeof loaderData.user>) => {
            if (loadedUserData.code !== "OK") return null;

            return (
              <div className="profile-user-container">
                <ProfileHeader
                  username={loadedUserData.content.name}
                  image={loadedUserData.content.image}
                  workouts={loadedUserData.content.totalCompletedWorkouts}
                  followers={loadedUserData.content.followers}
                  following={loadedUserData.content.following}
                  setFollowersOrFollowing={(x) => {
                    void navigate(`/me/${x}`);
                  }}
                />

                <div className="profile-body">
                  <Async
                    await={loaderData.streak}
                    skeleton={<ProfileSkeleton />}
                  >
                    {(loadedStreakData) => {
                      if (loadedStreakData.code !== "OK") return null;

                      return (
                        <>
                          <ActivityGrid
                            userId={loadedUserData.content.id}
                            latestActivity={loadedStreakData.content}
                            joinedAt={new Date(loadedUserData.content.joinedAt)}
                          />
                        </>
                      );
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
                </div>
              </div>
            );
          }}
        </Async>
      </div>
    </NewWorkoutsContext.Provider>
  );
}
