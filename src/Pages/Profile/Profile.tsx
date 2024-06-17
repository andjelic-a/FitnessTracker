import { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
//import { logout } from "../../Data/User";
import User from "../../Types/Models/User";
import { Immutable } from "../../Types/Utility/Models";
import Icon from "../../Components/Icon/Icon";
import InputFiled from "../../Components/InputField/InputField";
import "./Profile.scss";

export default function Profile() {
  const navigate = useNavigate();
  const userData = useLoaderData() as Promise<unknown>;

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
                  <InputFiled className="profile-workouts-search" placeholder="Search workouts"/>
                  <div className="profile-workouts-items-container">
                    <div>
                      <img src="./././public/vite.svg" />
                      <p>Workout 1</p>
                    </div>
                    <div>
                      <img src="./././public/vite.svg" />
                      <p>Workout 2</p>
                    </div>
                    <div>
                      <img src="./././public/vite.svg" />
                      <p>Workout 3</p>
                    </div>
                    <div>
                      <img src="./././public/vite.svg" />
                      <p>Workout 4</p>
                    </div>
                  </div>
                  </div>
                </div>
                <div className="profile-user-container">
                  <div className="profile-header">
                    <div className="profile-picture">
                      <img src="" />
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
