import "./FollowContainer.scss";
import AnimatedLayout from "../WindowWrapper/AnimatedLayout";
import { AnimatePresence } from "framer-motion";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type FollowContainerProps = {
  followersOrFollowing: "followers" | "following";
  isOpen: boolean;
};

function FollowContainer({
  isOpen,
  followersOrFollowing,
}: FollowContainerProps) {
  const navigate = useNavigate();
  const params = useParams();
  const searchBarRef = useRef<HTMLInputElement>(null);

  const [baseRequestParameters, setBaseRequestParameters] = useState<{
    limit: number;
    offset: number;
    username: string | undefined;
    searchTerm: string | undefined;
  }>({
    limit: 10,
    offset: 0,
    username: "username" in params ? params.username : undefined,
    searchTerm: undefined,
  });

  function constructRequestParameters() {
    setBaseRequestParameters((x) => ({
      ...x,
      username: "username" in params ? params.username : undefined,
      searchTerm:
        searchBarRef.current && searchBarRef.current.value.trim().length > 0
          ? searchBarRef.current.value.trim()
          : undefined,
    }));
  }

  useEffect(constructRequestParameters, [
    followersOrFollowing,
    params,
    searchBarRef,
  ]);

  return (
    <AnimatePresence>
      {isOpen && (
        <AnimatedLayout
          variants={{
            enter: {
              position: "absolute",
              top: "0",
              left: "100%",
              x: "-100%",
              opacity: 1,
              zIndex: 1000,
            },
            exit: {
              x: "0",
            },
            hidden: {
              x: "0",
              opacity: 0.7,
            },
          }}
        >
          <div className="follow-container">
            <div className="follow-container-search">
              <input type="text" placeholder="Search" ref={searchBarRef} />

              <button onClick={constructRequestParameters}>Search</button>
            </div>

            <LazyLoadingContainer
              endpoint={
                "username" in params
                  ? `/api/user/{username}/${followersOrFollowing}`
                  : `/api/user/me/${followersOrFollowing}`
              }
              baseAPIRequest={{
                method: "get",
                parameters: baseRequestParameters,
              }}
              onSegmentLoad={(segmentResponse) => {
                if (segmentResponse.code !== "OK") return;

                return (
                  <>
                    {segmentResponse.content.map((x) => (
                      <div
                        className="follow-container-user"
                        key={x.username}
                        onClick={() => void navigate(`/user/${x.username}`)}
                      >
                        <img
                          src={x.image ?? "/DefaultProfilePicture.png"}
                          alt={`Profile picture of a user named ${x.username}`}
                        />
                        <p>{x.name}</p>
                      </div>
                    ))}
                  </>
                );
                ``;
              }}
              stopCondition={(x) =>
                (x.code !== "OK" && x.code !== "Too Many Requests") ||
                (x.code === "OK" && x.content.length < 10)
              }
            />
          </div>
        </AnimatedLayout>
      )}
    </AnimatePresence>
  );
}

export default FollowContainer;
