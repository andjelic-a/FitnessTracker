import { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Immutable } from "../../Types/Utility/Models";
import { logout } from "../../Data/User";
import User from "../../Types/Models/User";
import ProdileHeader from "../../Components/ProfileHeader/ProfileHeader";
import WorkoutsContainer from "../../Components/WorkoutsContainer/WorkoutsContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
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
                <WorkoutsContainer />
                <div className="profile-user-container">
                <ProdileHeader username={loadedUserData.name} />
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
      {<button onClick={() => logout().then(() => navigate("/authentication"))}>
        Logout
      </button>}
    </div>
  );
}