import "./User.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import userLoader from "./UserLoader";
import { LoaderReturnType } from "../../BetterRouter/CreateLoader";
import { useEffect, useRef, useState } from "react";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import ProfileTabs from "../../Components/ProfileTabs/ProfileTabs";
import Pins from "../../Components/Pins/Pins";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { useNavigate } from "react-router-dom";
import AnimatedOutlet from "../../Components/WindowWrapper/AnimatedOutlet";

export default function UserPage() {
  const loaderData = useLoaderData<typeof userLoader>();

  const [loaderDataState, setLoaderDataState] = useState<
    | {
        [key in keyof LoaderReturnType<typeof userLoader>]: Awaited<
          LoaderReturnType<typeof userLoader>[key]
        >;
      }
    | null
  >(null);

  useEffect(() => {
    if (!loaderData) return;

    Promise.all([
      loaderData.user,
      loaderData.pins,
      loaderData.latestWeekOfActivity,
      loaderData.streak,
    ]).then((x) => {
      setLoaderDataState({
        user: x[0],
        pins: x[1],
        latestWeekOfActivity: x[2],
        streak: x[3],
      });
    });
  }, [loaderData]);

  return (
    <div className="profile">
      <InnerProfile loaderDataState={loaderDataState} />
    </div>
  );
}

function InnerProfile({
  loaderDataState,
}: {
  loaderDataState:
    | {
        [Key in keyof LoaderReturnType<typeof userLoader>]: Awaited<
          LoaderReturnType<typeof userLoader>[Key]
        >;
      }
    | null;
}) {
  const navigate = useNavigate();

  const isMe =
    loaderDataState?.user.code === "OK" && loaderDataState.user.content.isMe;

  const [isFollowing, setIsFollowing] = useState<boolean>(
    loaderDataState?.user.code === "OK" &&
      loaderDataState.user.content.isFollowing
  );
  const isWaitingForResponse = useRef(false);

  function handleFollowToggle() {
    if (loaderDataState?.user.code !== "OK") return;

    if (isWaitingForResponse.current) return;
    isWaitingForResponse.current = true;

    setIsFollowing(!isFollowing);

    sendAPIRequest("/api/user/{username}/follow", {
      method: isFollowing ? "delete" : "post",
      parameters: {
        username: loaderDataState.user.content.username,
      },
    }).then(() => void (isWaitingForResponse.current = false));
  }

  if (loaderDataState?.user.code !== "OK") return <></>;

  return (
    <>
      <ProfileHeader
        user={loaderDataState.user.content}
        includeEditButton={isMe}
        includeFollowButton={!isMe}
        handleFollow={isMe ? undefined : handleFollowToggle}
        isFollowing={isMe ? undefined : isFollowing}
      />

      <div className="profile-body">
        {isMe && (
          <>
            <button onClick={() => void navigate("workout/new")}>
              New Workout
            </button>

            <button onClick={() => void navigate("split/new")}>
              New Split
            </button>
          </>
        )}

        {loaderDataState.pins.code === "OK" && (
          <Pins pins={loaderDataState.pins.content} includeEditButtons={isMe} />
        )}

        <ProfileTabs
          latestActivity={
            loaderDataState.latestWeekOfActivity.code === "OK"
              ? loaderDataState.latestWeekOfActivity.content
              : null
          }
          split={loaderDataState.user.content.currentSplit}
        />

        {loaderDataState.user.code === "OK" && (
          <ActivityGrid
            username={loaderDataState.user.content.username}
            joinedAt={new Date(loaderDataState.user.content.joinedAt)}
          />
        )}
      </div>

      <AnimatedOutlet />
    </>
  );
}
