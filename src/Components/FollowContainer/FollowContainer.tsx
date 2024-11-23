import "./FollowContainer.scss";
import { AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import AnimatedLayout from "../WindowWrapper/AnimatedLayout";
import Icon from "../Icon/Icon";

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
    username: string;
    searchTerm: string | undefined;
  }>({
    limit: 10,
    offset: 0,
    username: params.username ?? "",
    searchTerm: undefined,
  });

  function constructRequestParameters() {
    setBaseRequestParameters((x) => ({
      ...x,
      username: params.username ?? "",
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
    <AnimatePresence mode="wait">
      {isOpen && (
        <AnimatedLayout
          key={followersOrFollowing}
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
              transition: {
                duration: 0.175,
              },
            },
            hidden: {
              x: "0",
              opacity: 0.7,
            },
          }}
        >
          <div className="follow-container">
            <div className="follow-container-header">
              <h3>{followersOrFollowing === "followers" ? "Followers" : "Following"}</h3>

              <div className="follow-container-search">
                <input type="text" placeholder="Search" ref={searchBarRef} />
                <Icon
                  name="search"
                  className="follow-container-search-button"
                  onClick={constructRequestParameters}
                />
              </div>
            </div>

            <LazyLoadingContainer
              endpoint={`/api/user/{username}/${followersOrFollowing}`}
              baseAPIRequest={{
                method: "get",
                parameters: baseRequestParameters,
              }}
              onSegmentLoad={(segmentResponse) => {
                if (segmentResponse.code !== "OK") return;

                return (
                  <div className="follow-container-body">
                    {segmentResponse.content.map((x) => (
                      <div
                        className="follow-container-user"
                        key={x.username}
                        onClick={() => void navigate(`/${x.username}`)}
                      >
                        <img
                          src={x.image ?? "/DefaultProfilePicture.png"}
                          alt={`Profile picture of a user named ${x.username}`}
                        />
                        <p>{x.name}</p>
                      </div>
                    ))}
                  </div>
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
