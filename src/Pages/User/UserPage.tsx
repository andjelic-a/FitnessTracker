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
    ]).then((x) => {
      setLoaderDataState({
        user: x[0],
        pins: x[1],
        latestWeekOfActivity: x[2],
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
  useEffect(() => {
    setIsFollowing(
      loaderDataState?.user.code === "OK" &&
        loaderDataState.user.content.isFollowing
    );
  }, [loaderDataState]);

  const isMe =
    loaderDataState?.user.code === "OK" && loaderDataState.user.content.isMe;

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
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
        key={loaderDataState.user.content.username + "-header"}
        user={loaderDataState.user.content}
        includeEditButton={isMe}
        includeFollowButton={!isMe}
        handleFollow={isMe ? undefined : handleFollowToggle}
        isFollowing={isMe ? undefined : isFollowing}
      />

      <div
        className="profile-body"
        key={loaderDataState.user.content.username + "-body"}
      >
        {loaderDataState.pins.code === "OK" && (
          <Pins
            key={loaderDataState.user.content.username + "-pins"}
            pins={loaderDataState.pins.content}
            includeEditButtons={isMe}
          />
        )}

        <ProfileTabs
          key={loaderDataState.user.content.username + "-tabs"}
          latestActivity={
            loaderDataState.latestWeekOfActivity.code === "OK"
              ? loaderDataState.latestWeekOfActivity.content
              : null
          }
          split={loaderDataState.user.content.currentSplit}
          isMe={isMe}
        />

        {loaderDataState.user.code === "OK" && (
          <ActivityGrid
            key={loaderDataState.user.content.username + "-activity"}
            username={loaderDataState.user.content.username}
            joinedAt={new Date(loaderDataState.user.content.joinedAt)}
          />
        )}
      </div>

      <AnimatedOutlet />
    </>
  );
}
