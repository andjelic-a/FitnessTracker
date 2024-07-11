import { useState, Suspense, useRef } from "react";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import WorkoutsContainer from "../../Components/WorkoutsContainer/WorkoutsContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import FollowContainer from "../../Components/FollowContainer/FollowContainer";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import CreateRoutineWindow from "../../Components/WorkoutsContainer/CreateRoutine/CreateRoutine";
import { Await, useLoaderData } from "react-router-dom";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

export default function Profile() {
  const userData = useLoaderData() as {
    user: Promise<APIResponse<"/api/user/me/detailed", "get">>;
    workouts: Promise<APIResponse<"/api/workout/personal/simple", "get">>;
  };

  const [isNewRoutineWindowOpen, setIsNewRoutineWindowOpen] =
    useState<boolean>(false);
  const toggleNewWorkoutWindow = () =>
    void setIsNewRoutineWindowOpen((prev) => !prev);

  const [followersOrFollowing, setFollowersOrFollowing] = useState<
    "followers" | "following" | null
  >(null);

  const followContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(followContainerRef, () => {
    if (followersOrFollowing) {
      setFollowersOrFollowing(null);
    }
  });

  return (
    <div className="profile">
      <CreateRoutineWindow
        isVisible={isNewRoutineWindowOpen}
        onClose={() => setIsNewRoutineWindowOpen(false)}
        animationLength={0.2}
        safeGuard={100}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={userData.workouts}>
          {(loadedWorkoutData: Awaited<typeof userData.workouts>) => {
            if (loadedWorkoutData.code !== "OK") return null;

            return (
              <WorkoutsContainer
                workouts={loadedWorkoutData.content}
                toggleNewWorkoutWindow={toggleNewWorkoutWindow}
              />
            );
          }}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={userData.user}>
          {(loadedUserData: Awaited<typeof userData.user>) => {
            if (loadedUserData.code !== "OK") return null;

            return (
              <div className="profile-user-container">
                <FollowContainer
                  userId={loadedUserData.content.id}
                  ref={followContainerRef}
                  followersOrFollowing={followersOrFollowing}
                />

                <ProfileHeader
                  username={loadedUserData.content.name}
                  image={loadedUserData.content.image}
                  workouts={loadedUserData.content.totalCompletedWorkouts}
                  followers={loadedUserData.content.followers}
                  following={loadedUserData.content.following}
                  setFollowersOrFollowing={setFollowersOrFollowing}
                />

                <button className="profile-edit-button">Edit Profile</button>

                <div className="profile-body">
                  <ActivityGrid
                    userId={loadedUserData.content.id}
                    latestActivity={loadedUserData.content.streak}
                    joinedAt={new Date(loadedUserData.content.joinedAt)}
                  />
                </div>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
