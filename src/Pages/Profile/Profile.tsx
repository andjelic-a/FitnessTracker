import { useState, Suspense, useRef } from "react";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import WorkoutsContainer from "../../Components/WorkoutsContainer/WorkoutsContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import CreateRoutine from "../../Components/WorkoutsContainer/CreateRoutine/CreateRoutine";
import FollowContainer from "../../Components/FollowContainer/FollowContainer";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import { Await, useLoaderData } from "react-router-dom";
import "./Profile.scss";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

interface Workout {
  id: string;
  name: string;
  image: string | null;
}

export default function Profile() {
  const userData = useLoaderData() as {
    user: Promise<APIResponse<"/api/user/me/detailed", "get">>;
    workouts: Promise<APIResponse<"/api/workout/personal/simple", "get">>;
  };

  const [isNewWindowOpen, setIsNewWindowOpen] = useState<boolean>(false);
  const [folowersOrFollowing, setFollowersOrFollowing] = useState<
    "followers" | "following" | null
  >(null);

  const followContainerRef = useRef<HTMLDivElement>(null);

  const toggleNewWorkoutWindow = () => {
    setIsNewWindowOpen((prev) => !prev);
  };

  useOutsideClick(followContainerRef, () => {
    if (folowersOrFollowing) {
      setFollowersOrFollowing(null);
    }
  });

  return (
    <div className="profile">
      <CreateRoutine
        isNewWindowOpen={isNewWindowOpen}
        setIsNewWindowOpen={setIsNewWindowOpen}
        animationLength={0.2}
        safeGuard={100}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={userData.user}>
          {(loadedUserData: Awaited<typeof userData.user>) => {
            if (loadedUserData.code !== "OK") return null;

            return (
              <>
                <Suspense fallback={<div>Loading...</div>}>
                  <Await resolve={userData.workouts}>
                    {(loadedWorkoutData: Awaited<typeof userData.workouts>) => {
                      if (loadedWorkoutData.code !== "OK") return null;

                      const workouts: Workout[] = loadedWorkoutData.content.map(
                        (workout) => ({
                          id: workout.id,
                          name: workout.name,
                          image: workout.creator.image,
                        })
                      );

                      return (
                        <WorkoutsContainer
                          workouts={workouts}
                          toggleNewWorkoutWindow={toggleNewWorkoutWindow}
                        />
                      );
                    }}
                  </Await>
                </Suspense>
                <div className="profile-user-container">
                  <FollowContainer
                    ref = {followContainerRef}
                    folowersOrFollowing={folowersOrFollowing}
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
                    <ActivityGrid activity={loadedUserData.content.streak} />
                  </div>
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
      {/*<button onClick={() => logout().then(() => navigate("/authentication"))}>
        Logout
      </button>*/}
    </div>
  );
}
