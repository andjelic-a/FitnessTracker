import "./FollowContainer.scss";
import AnimatedLayout from "../WindowWrapper/AnimatedLayout";
import { AnimatePresence } from "framer-motion";

type FollowContainerProps = {
  followersOrFollowing: "followers" | "following";
  isOpen: boolean;
};

function FollowContainer({
  followersOrFollowing,
  isOpen,
}: FollowContainerProps) {
  console.log("rerender");

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
              position: "absolute",
              top: "0",
              left: "100%",
              x: "0",
              zIndex: 1000,
            },
            hidden: {
              position: "absolute",
              top: "0",
              left: "100%",
              x: "0",
              opacity: 0.7,
              zIndex: 1000,
            },
          }}
        >
          <div className="follow-container">{followersOrFollowing}</div>;
        </AnimatedLayout>
      )}
    </AnimatePresence>
  );
}

export default FollowContainer;
