import { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { logout } from "../../Data/User";
import User from "../../Types/Models/User";
import { Immutable } from "../../Types/Utility/Models";
import "./Profile.scss";

export default function Profile() {
  const navigate = useNavigate();
  const userData = useLoaderData() as Promise<unknown>;

  return (
    <div className="profile">
      <div className="profile-container">Profile</div>
      <div className="profile-user-container">
        <div className="profile-header">
          <div className="profile-picture">
            <img src="" alt="Profile picture" />
          </div>
          <div className="profile-user-information">
            <Suspense fallback={<div>Loading...</div>}>
              <Await resolve={"user" in userData ? userData.user : null}>
                {(loadedUserData: Immutable<Omit<User, "id">> | null) => {
                  if (!loadedUserData) {
                    navigate("/authentication");
                    return null;
                  }

                  return (
                    <>
                      <div className="profile-user-username">
                        <p>{loadedUserData.name}</p>
                      </div>
                      <div className="profile-user-stats">
                        <div><div>Workouts</div><div>1</div></div>
                        <div><div>Followers</div><div>1</div></div>
                        <div><div>Following</div><div>1</div></div>
                      </div>
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </div>
        <button className="profile-edit-button">Edit Profile</button>
        <br /><br /><br /><br /><br />
        <button
          onClick={() => logout().then(() => navigate("/authentication"))}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
