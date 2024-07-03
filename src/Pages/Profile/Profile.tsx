import { Suspense, useState, useRef, useEffect } from "react";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import WorkoutsContainer from "../../Components/WorkoutsContainer/WorkoutsContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
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

  const excludedDiv = useRef<HTMLDivElement | null>(null);


  const toggleNewWorkoutWindow = () => {
    setIsNewWindowOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (excludedDiv.current && !excludedDiv.current.contains(event.target as Node)) {
        setIsNewWindowOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  
  

  return (
    <div className="profile">
      <div
        ref={excludedDiv}
        className={`profile-workouts-new ${
          isNewWindowOpen ? "new-window-open" : ""
        }`}
      >
        <div className="profile-workouts-new-header">
          <input type="text" id="routine-title" placeholder="Routine title" />
          <button className="profile-workouts-new-save">Save</button>
        </div>
      </div>
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
