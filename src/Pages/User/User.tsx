import { Suspense, useEffect, useRef, useState } from "react";
import "./User.scss";
import { Await, useLoaderData } from "react-router-dom";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import FollowContainer from "../../Components/FollowContainer/FollowContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import useOutsideClick from "../../Hooks/UseOutsideClick";

export default function User() {
  const data = useLoaderData() as {
    user: Promise<APIResponse<"/api/user/{id}/detailed", "get">>;
  };

  const [followingOrFollowers, setFollowingOrFollowers] = useState<
    "followers" | "following" | null
  >(null);

  useEffect(() => void setFollowingOrFollowers(null), [data]);

  const followerContainerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    followerContainerRef,
    () => void setFollowingOrFollowers(null)
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={data.user}>
        {(response: Awaited<typeof data.user>) => {
          if (response.code !== "OK") return null;

          return (
            <div className="profile">
              <div className="profile-user-container">
                <ProfileHeader
                  image={response.content.image}
                  username={response.content.name}
                  workouts={response.content.totalCompletedWorkouts}
                  followers={response.content.followers}
                  following={response.content.following}
                  setFollowersOrFollowing={setFollowingOrFollowers}
                />

                <FollowContainer
                  userId={response.content.id}
                  followersOrFollowing={followingOrFollowers}
                  ref={followerContainerRef}
                />

                <div className="profile-body">
                  <ActivityGrid activity={response.content.streak} />
                </div>
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
