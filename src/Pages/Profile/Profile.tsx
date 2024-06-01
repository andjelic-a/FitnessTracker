import { Suspense, useEffect } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { getIsLoggedIn } from "../../Data/User";
import User from "../../Types/Models/User";
import { Immutable } from "../../Types/Utility/Models";

export default function Profile() {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("check");
    if (!getIsLoggedIn()) navigate("/authentication");
  }, [navigate]);

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
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/authentication");
        }}
      >
        Logout
      </button>
    </div>
  );
}
