import "./FollowContainer.scss";
import AnimatedLayout from "../WindowWrapper/AnimatedLayout";
import { AnimatePresence } from "framer-motion";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import { useNavigate, useParams } from "react-router-dom";

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
            <LazyLoadingContainer
              endpoint={
                "username" in params
                  ? `/api/user/{username}/${followersOrFollowing}`
                  : `/api/user/me/${followersOrFollowing}`
              }
              baseAPIRequest={{
                method: "get",
                parameters: {
                  limit: 10,
                  offset: 0,
                  username: "username" in params ? params.username : undefined,
                },
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
              }}
              stopCondition={(x) =>
                (x.code !== "OK" && x.code !== "Too Many Requests") ||
                (x.code === "OK" && x.content.length < 10)
              }
            />
          </div>
          ;
        </AnimatedLayout>
      )}
    </AnimatePresence>
  );
}

export default FollowContainer;
