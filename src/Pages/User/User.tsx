import { Suspense, useEffect, useRef, useState } from "react";
import "./User.scss";
import { Await, useLoaderData } from "react-router-dom";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import FollowContainer from "../../Components/FollowContainer/FollowContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../Data/SendAPIRequest";

export default function User() {
  const data = useLoaderData() as {
    user: Promise<APIResponse<"/api/user/{id}/detailed", "get">>;
  };

  const [followingOrFollowers, setFollowingOrFollowers] = useState<
    "followers" | "following" | null
  >(null);

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [followers, setFollowers] = useState<number | null>(null);

  useEffect(() => {
    setFollowingOrFollowers(null);
    setFollowers(null);
    setIsFollowing(null);
  }, [data]);

  const followerContainerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    followerContainerRef,
    () => void setFollowingOrFollowers(null)
  );

  async function onToggleFollow(
    userId: string,
    isFollowingFromRequest: boolean,
    followersFromRequest: number
  ) {
    sendAPIRequest("/api/user/{id}/follow", {
      method: isFollowing ?? isFollowingFromRequest ? "delete" : "post",
      parameters: { id: userId },
    });

    setFollowers(
      (followers ?? followersFromRequest) +
        (isFollowing ?? isFollowingFromRequest ? -1 : 1)
    );
    setIsFollowing(!(isFollowing ?? isFollowingFromRequest));
  }

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
                  followers={followers ?? response.content.followers}
                  following={response.content.following}
                  setFollowersOrFollowing={setFollowingOrFollowers}
                />

                <button
                  onClick={() => {
                    if (response.content.isMe) {
                      console.log("Hi");
                      return;
                    }

                    onToggleFollow(
                      response.content.id,
                      response.content.isFollowing,
                      response.content.followers
                    );
                  }}
                >
                  {response.content.isMe
                    ? "It's me!"
                    : isFollowing ?? response.content.isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>

                <FollowContainer
                  userId={response.content.id}
                  followersOrFollowing={followingOrFollowers}
                  ref={followerContainerRef}
                />

                <div className="profile-body">
                  <ActivityGrid
                    latestActivity={response.content.streak}
                    joinedAt={new Date(response.content.joinedAt)}
                    userId={response.content.id}
                  />
                </div>
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
