import { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
//import { logout } from "../../Data/User";
import User from "../../Types/Models/User";
import { Immutable } from "../../Types/Utility/Models";
import Icon from "../../Components/Icon/Icon";
import InputFiled from "../../Components/InputField/InputField";
import "./Profile.scss";

interface Workout {
  id: number;
  name: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const userData = useLoaderData() as Promise<unknown>;

  const [showAll, setShowAll] = useState<boolean>(false);

  const workouts: Workout[] = [
    { id: 1, name: "Workout 1" },
    { id: 2, name: "Workout 2" },
    { id: 3, name: "Workout 3" },
    { id: 4, name: "Workout 4" },
    { id: 5, name: "Workout 5" },
    { id: 6, name: "Workout 6" },
    { id: 7, name: "Workout 7" },
    { id: 8, name: "Workout 8" },
    { id: 9, name: "Workout 9" },
    { id: 10, name: "Workout 10" },
    { id: 11, name: "Workout 11" },
    { id: 12, name: "Workout 12" },
    { id: 13, name: "Workout 13" },
    { id: 14, name: "Workout 14" },
    { id: 15, name: "Workout 15" },
    { id: 16, name: "Workout 16" },
    { id: 17, name: "Workout 17" },
    { id: 18, name: "Workout 18" },
  ];

  const displayedWorkouts = showAll ? workouts : workouts.slice(0, 8);

  const toggleShowAll = () => {
    setShowAll((prevState) => !prevState);
  };

  return (
    <div className="profile">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={"user" in userData ? userData.user : null}>
          {(loadedUserData: Immutable<Omit<User, "id">> | null) => {
            if (!loadedUserData) {
              navigate("/authentication");
              return null;
            }

            return (
              <>
                <div className="profile-workouts-container">
                  <div className="profile-workouts-header">
                    <h1>Workouts</h1>
                    <button>
                      <Icon className="icon" name="plus" />
                      <p>New</p>
                    </button>
                  </div>
                  <div className="profile-workouts-body">
                    <InputFiled
                      className="profile-workouts-search"
                      placeholder="Search workouts"
                    />
                    <div className="profile-workouts-items-container">
                      {displayedWorkouts.map((workout) => (
                        <div key={workout.id}>
                          <img src="./././public/vite.svg" alt={workout.name} />
                          <p>{workout.name}</p>
                        </div>
                      ))}
                      {workouts.length > 8 && (
                        <button
                          className="profile-workouts-show"
                          onClick={toggleShowAll}
                        >
                          {showAll ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="profile-user-container">
                  <div className="profile-header">
                    <div className="profile-picture">
                      <img src="" alt="Profile Picture" />
                    </div>
                    <div className="profile-user-information">
                      <div className="profile-user-username">
                        <p>{loadedUserData.name}</p>
                        <Icon
                          className="profile-user-settings"
                          id="solid"
                          name="gear"
                        />
                      </div>
                      <div className="profile-user-stats">
                        <div className="profile-user-stats-stat">
                          <div className="profile-user-stats-name">
                            Workouts
                          </div>
                          <div className="profile-user-stats-num">1</div>
                        </div>
                        <div className="profile-user-stats-stat">
                          <div className="profile-user-stats-name">
                            Followers
                          </div>
                          <div className="profile-user-stats-num">1</div>
                        </div>
                        <div className="profile-user-stats-stat">
                          <div className="profile-user-stats-name">
                            Following
                          </div>
                          <div className="profile-user-stats-num">1</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="profile-edit-button">Edit Profile</button>
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
      {/* <button onClick={() => logout().then(() => navigate("/authentication"))}>
        Logout
      </button>*/}
    </div>
  );
}
