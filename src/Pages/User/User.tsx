import "./User.scss";
import { Suspense, useEffect, useRef, useState } from "react";
import { Await } from "react-router-dom";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import FollowContainer from "../../Components/FollowContainer/FollowContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import sendAPIRequest from "../../Data/SendAPIRequest";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import userLoader from "./UserLoader";

export default function User() {
  const data = useLoaderData<typeof userLoader>();

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
        {(userData: Awaited<typeof data.user>) => {
          if (userData.code !== "OK") return null;

          return (
            <div className="profile">
              <div className="profile-user-container">
                <ProfileHeader
                  image={userData.content.image}
                  username={userData.content.name}
                  workouts={userData.content.totalCompletedWorkouts}
                  followers={followers ?? userData.content.followers}
                  following={userData.content.following}
                  setFollowersOrFollowing={setFollowingOrFollowers}
                />

                <button
                  onClick={() => {
                    if (userData.content.isMe) {
                      console.log("Hi");
                      return;
                    }

                    onToggleFollow(
                      userData.content.id,
                      userData.content.isFollowing,
                      userData.content.followers
                    );
                  }}
                >
                  {userData.content.isMe
                    ? "It's me!"
                    : isFollowing ?? userData.content.isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </button>

                <FollowContainer
                  userId={userData.content.id}
                  followersOrFollowing={followingOrFollowers}
                  ref={followerContainerRef}
                />

                <Suspense fallback={<div>Loading...</div>}>
                  <Await resolve={data.streak}>
                    {(streakData: Awaited<typeof data.streak>) => {
                      if (streakData.code !== "OK") return null;

                      return (
                        <ActivityGrid
                          userId={userData.content.id}
                          latestActivity={streakData.content}
                          joinedAt={new Date(userData.content.joinedAt)}
                        />
                      );
                    }}
                  </Await>
                </Suspense>
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}
