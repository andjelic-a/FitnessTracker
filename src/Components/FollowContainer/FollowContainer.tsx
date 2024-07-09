import { forwardRef } from 'react';
import "./FollowContainer.scss";

interface FollowContainerProps {
  folowersOrFollowing: "followers" | "following" | null;
}

const FollowContainer = forwardRef<HTMLDivElement, FollowContainerProps>(({ folowersOrFollowing }, ref) => {
  return (
    <div ref={ref} className={`follow-container ${!folowersOrFollowing ? "hidden" : ""}`}>
      <div className="follow-container-header">
        {folowersOrFollowing === "followers" ? "Followers" : "Following"}
      </div>
    </div>
  );
});

export default FollowContainer;
