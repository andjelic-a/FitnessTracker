import { useState, Suspense } from "react";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import WorkoutsContainer from "../../Components/WorkoutsContainer/WorkoutsContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import CreateRoutine from "../../Components/WorkoutsContainer/CreateRoutine/CreateRoutine";
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

  const toggleNewWorkoutWindow = () => {
    setIsNewWindowOpen((prev) => !prev);
  };

  return (
    <div className="profile">
      <CreateRoutine isNewWindowOpen={isNewWindowOpen} setIsNewWindowOpen={setIsNewWindowOpen} />
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
                  <ProfileHeader
                    username={loadedUserData.content.name}
                    image={loadedUserData.content.image}
                    workouts={loadedUserData.content.completedWorkouts}
                    followers={loadedUserData.content.followers}
                    following={loadedUserData.content.following}
                  />
                  <button className="profile-edit-button">Edit Profile</button>
                  <div className="profile-body">
                    <ActivityGrid />
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
