import { forwardRef, Suspense, useRef } from "react";
import "./FollowContainer.scss";
import { Await } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import useLazyLoading from "../../Hooks/UseLazyLoading";

type FollowContainerProps = {
  userId: string;
  followersOrFollowing: "followers" | "following" | null;
};

const FollowContainer = forwardRef<HTMLDivElement, FollowContainerProps>(
  ({ followersOrFollowing, userId }, ref) => {
    const followers = useRef<Schema<"SimpleUserResponseDTO">[]>([]);
    const following = useRef<Schema<"SimpleUserResponseDTO">[]>([]);
    const waitingFor = useRef<{
      type: "followers" | "following";
      data: Promise<Schema<"SimpleUserResponseDTO">[]>;
    } | null>(null);
    const reachedEnd = useRef<{
      followers: boolean;
      following: boolean;
    }>({ followers: false, following: false });

    useLazyLoading("#followContainer", 0.75, () => void getData(true));

    async function getData(lazyLoad: boolean = false) {
      if (!followersOrFollowing) return [];

      if (
        followersOrFollowing === "followers" &&
        (reachedEnd.current.followers ||
          (!lazyLoad && followers.current.length > 0))
      )
        return followers.current;

      if (
        followersOrFollowing === "following" &&
        (reachedEnd.current.following ||
          (lazyLoad && following.current.length > 0))
      )
        return following.current;

      if (waitingFor.current)
        return waitingFor.current.type === followersOrFollowing
          ? await waitingFor.current.data
          : [];

      waitingFor.current = {
        data: sendAPIRequest(
          followersOrFollowing === "followers"
            ? "/api/user/{id}/followers"
            : "/api/user/{id}/following",
          {
            method: "get",
            parameters: {
              id: userId,
              offset:
                followersOrFollowing === "followers"
                  ? followers.current.length
                  : following.current.length,
              limit: 10,
            },
          },
          null
        ).then((x) => {
          waitingFor.current = null;
          if (x.code === "OK")
            followersOrFollowing === "followers"
              ? (reachedEnd.current.followers = x.content.length < 10)
              : (reachedEnd.current.following = x.content.length < 10);

          return x.code === "OK" ? x.content : [];
        }),
        type: followersOrFollowing,
      };

      const userDTOs = await waitingFor.current?.data;

      followersOrFollowing === "followers"
        ? followers.current.push(...userDTOs)
        : following.current.push(...userDTOs);

      return followersOrFollowing === "followers"
        ? followers.current
        : following.current;
    }

    return (
      <div
        ref={ref}
        id="#follow-container"
        className={`follow-container ${!followersOrFollowing ? "hidden" : ""}`}
      >
        <div className="follow-container-header">
          {followersOrFollowing === "followers" ? "Followers" : "Following"}
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={getData()}>
            {(userDTOs: Awaited<ReturnType<typeof getData>>) => {
              return userDTOs.map((x) => (
                <div className="follow-container-user" key={x.id}>
                  <img
                    src={x.image ?? "/DefaultProfilePicture.png"}
                    alt={`Profile picture of a user named ${x.name}`}
                  />
                  <p>{x.name}</p>
                </div>
              ));
            }}
          </Await>
        </Suspense>
      </div>
    );
  }
);

export default FollowContainer;
