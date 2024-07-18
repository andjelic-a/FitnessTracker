import "./FollowContainer.scss";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import useLazyLoading from "../../Hooks/UseLazyLoading";
import Async from "../Async/Async";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import profileFollowersContainerLoader from "./ProfileFollowersContainerLoader";
import profileFollowingContainerLoader from "./ProfileFollowingContainerLoader";
import WindowFC from "../WindowWrapper/WindowFC";

type FollowContainerProps = {
  followersOrFollowing: "followers" | "following" | null;
};

const FollowContainer = WindowFC<FollowContainerProps>(
  ({ followersOrFollowing }, wrapperRef) => {
    const navigate = useNavigate();

    const loaderData = useLoaderData<
      | typeof profileFollowersContainerLoader
      | typeof profileFollowingContainerLoader
    >();

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

    /*     useEffect(() => {
      followers.current = [];
      following.current = [];
      reachedEnd.current.followers = false;
      reachedEnd.current.following = false;
      waitingFor.current = null;
    }, [userId]); */

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

      /*       waitingFor.current = {
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
 */
      const userDTOs: any = []; // await waitingFor.current?.data;

      followersOrFollowing === "followers"
        ? followers.current.push(...userDTOs)
        : following.current.push(...userDTOs);

      return followersOrFollowing === "followers"
        ? followers.current
        : following.current;
    }

    return (
      <div
        id="follow-container"
        className={`follow-container ${!followersOrFollowing ? "hidden" : ""}`}
        ref={wrapperRef}
      >
        <div className="follow-container-header">
          {followersOrFollowing === "followers" ? "Followers" : "Following"}
        </div>

        <div className="follow-container-search">
          <input
            type="text"
            placeholder="Search"
            className="follow-container-search-input"
          />
        </div>

        {loaderData && (
          <Async
            await={
              loaderData.type === "followers"
                ? loaderData.followers
                : loaderData.following
            }
          >
            {(userDTOs) => {
              return userDTOs.map((x) => (
                <div
                  className="follow-container-user"
                  key={x.id}
                  onClick={() => void navigate(`/user/${x.id}`)}
                >
                  <img
                    src={x.image ?? "/DefaultProfilePicture.png"}
                    alt={`Profile picture of a user named ${x.name}`}
                  />
                  <p>{x.name}</p>
                </div>
              ));
            }}
          </Async>
        )}
      </div>
    );
  },
  {
    enter: {
      position: "absolute",
      top: "0",
      left: "100%",
      x: "-100%",
      opacity: 1,
      scaleY: 1,
    },
    exit: {
      position: "absolute",
      top: "0",
      left: "100%",
      x: "0",
      opacity: 0.7,
    },
    hidden: {
      position: "absolute",
      top: "0",
      left: "100%",
      x: "0",
      opacity: 0.7,
      scaleY: 0.9,
    },
  }
);

export default FollowContainer;
