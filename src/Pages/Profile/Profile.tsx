import { Suspense } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { logout } from "../../Data/User";
import User from "../../Types/Models/User";
import { Immutable } from "../../Types/Utility/Models";

export default function Profile() {
  const navigate = useNavigate();
  const userData = useLoaderData() as Promise<unknown>;

  return (
    <div>
      Profile
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={"user" in userData ? userData.user : null}>
          {(loadedUserData: Immutable<Omit<User, "id">> | null) => {
            if (!loadedUserData) {
              navigate("/authentication");
              return null;
            }

            return <div>{loadedUserData.name}</div>;
          }}
        </Await>
      </Suspense>
      <button onClick={() => logout().then(() => navigate("/authentication"))}>
        Logout
      </button>
    </div>
  );
}
