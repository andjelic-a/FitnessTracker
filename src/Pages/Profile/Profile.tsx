import { Suspense } from "react";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import WorkoutsContainer from "../../Components/WorkoutsContainer/WorkoutsContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import { Await, useLoaderData } from "react-router-dom";
import "./Profile.scss";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

interface Workout {
  id: string;
  name: string;
  image: any;
}

export default function Profile() {
  const userData = useLoaderData() as {
    user: Promise<APIResponse<"/api/user/me/detailed", "get">>;
    workouts: Promise<APIResponse<"/api/workout/personal/simple", "get">>;
  };

  return (
    <div className="profile">
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

                      const workouts: Workout[] = loadedWorkoutData.content.map(workout => ({
                        id: workout.id,
                        name: workout.name,
                        image: workout.creator.image,
                      }));

                      return (
                        <WorkoutsContainer workouts={workouts} />
                      );
                    }}
                  </Await>
                </Suspense>
                <div className="profile-user-container">
                  <ProfileHeader username={loadedUserData.content.name} />
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