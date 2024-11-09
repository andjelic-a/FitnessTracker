import "./User.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import userLoader from "./UserLoader";
import { LoaderReturnType } from "../../BetterRouter/CreateLoader";
import { useEffect, useRef, useState } from "react";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import ProfileTabs from "../../Components/ProfileTabs/ProfileTabs";
import Pins from "../../Components/Pins/Pins";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import { useNavigate } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";

export default function UserPage() {
  const loaderData = useLoaderData<typeof userLoader>();
  const navigate = useNavigate();

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
      if (x[0].code === "OK" && x[0].content.isMe) navigate("/me");

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
        [key in keyof LoaderReturnType<typeof userLoader>]: Awaited<
          LoaderReturnType<typeof userLoader>[key]
        >;
      }
    | null;
}) {
  if (loaderDataState?.user.code !== "OK") return <></>;

  const [isFollowing, setIsFollowing] = useState<boolean>(
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

  return (
    <>
      <ProfileHeader
        user={loaderDataState.user.content}
        includeFollowButton
        handleFollow={handleFollowToggle}
        isFollowing={isFollowing}
      />

      <div className="profile-body">
        {loaderDataState.pins.code === "OK" && (
          <Pins pins={loaderDataState.pins.content} />
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
    </>
  );
}
