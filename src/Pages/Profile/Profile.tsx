import { Suspense, useEffect } from "react";
import { Await, defer, useLoaderData, useNavigate } from "react-router-dom";
import { getCurrentUserData, getIsLoggedIn } from "../../Data/User";
import User from "../../Types/Models/User";
import { Immutable } from "../../Types/Utility/Models";

export default function Profile() {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("check");
    if (!getIsLoggedIn()) navigate("/login");
  }, [navigate]);

  const userData = useLoaderData() as ReturnType<typeof profileLoader>;

  return (
    <div>
      Profile
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={"user" in userData ? userData.user : null}>
          {(data: Immutable<Omit<User, "id">>) => <div>{data.name}</div>}
        </Await>
      </Suspense>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export async function profileLoader() {
  return defer({
    user: getCurrentUserData(),
  });
}
