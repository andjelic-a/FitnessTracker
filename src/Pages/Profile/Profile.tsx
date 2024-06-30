import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
//import { logout } from "../../Data/User";
import User from "../../Types/Models/User";
import { Immutable } from "../../Types/Utility/Models";
import Icon from "../../Components/Icon/Icon";
import "./Profile.scss";
import { APIResponseFromRequest } from "../../Types/Endpoints/ResponseParser";
import { APIRequest } from "../../Types/Endpoints/RequestParser";

export default function Profile() {
  // const navigate = useNavigate();
  const userData = useLoaderData() as {
    user: Promise<Immutable<Omit<User, "id">> | null>;
  };

  return (
    <div className="profile">
      <div className="profile-container">Profile</div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={userData.user}>
          {(
            loadedUserData: APIResponseFromRequest<APIRequest<"/api/user/me/detailed">>
          ) => {
            if (loadedUserData.code !== "OK") return null;
            console.log(loadedUserData);

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
