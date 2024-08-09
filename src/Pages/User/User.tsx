import "./User.scss";
import { useEffect, useState } from "react";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import sendAPIRequest from "../../Data/SendAPIRequest";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import userLoader from "./UserLoader";
import Async from "../../Components/Async/Async";
import AnimatedOutlet from "../../Components/WindowWrapper/AnimatedOutlet";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
  const data = useLoaderData<typeof userLoader>();

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [followers, setFollowers] = useState<number | null>(null);

  useEffect(() => {
    setFollowers(null);
    setIsFollowing(null);
  }, [data]);

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

  const navigate = useNavigate();

  return (
    <Async await={data.user}>
      {(userData) => {
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
                setFollowersOrFollowing={(x) => void navigate(x as string)}
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

              <AnimatedOutlet />

              <Async await={data.streak}>
                {(streakData) => {
                  if (streakData.code !== "OK") return null;

                  return (
                    <ActivityGrid
                      userId={userData.content.id}
                      latestActivity={streakData.content}
                      joinedAt={new Date(userData.content.joinedAt)}
                    />
                  );
                }}
              </Async>
            </div>
          </div>
        );
      }}
    </Async>
  );
}
