import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import Icon from "../../Components/Icon/Icon";
import "./Profile.scss";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

export default function Profile() {
  const userData = useLoaderData() as {
    user: Promise<APIResponse<"/api/user/me/detailed", "get">>;
  };

  return (
    <div className="profile">
      <div className="profile-container">Profile</div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={userData.user}>
          {(loadedUserData: Awaited<typeof userData.user>) => {
            if (loadedUserData.code !== "OK") return null;

            return (
              <div className="profile-user-container">
                <div className="profile-header">
                  <div className="profile-picture">
                    <img src="" alt="Profile picture" />
                  </div>
                  <div className="profile-user-information">
                    <div className="profile-user-username">
                      <p>{loadedUserData.content.name}</p>
                      <Icon
                        className="profile-user-settings"
                        id="solid"
                        name="gear"
                      />
                    </div>
                    <div className="profile-user-stats">
                      <div className="profile-user-stats-stat">
                        <div className="profile-user-stats-name">Workouts</div>
                        <div className="profile-user-stats-num">1</div>
                      </div>
                      <div className="profile-user-stats-stat">
                        <div className="profile-user-stats-name">Followers</div>
                        <div className="profile-user-stats-num">1</div>
                      </div>
                      <div className="profile-user-stats-stat">
                        <div className="profile-user-stats-name">Following</div>
                        <div className="profile-user-stats-num">1</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="profile-edit-button">Edit Profile</button>
              </div>
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
