import { useContext, useEffect, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import "./ProfileHeader.scss";
import { useNavigate } from "react-router-dom";
import FollowContainer from "../FollowContainer/FollowContainer";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

type ProfileHeaderProps = {
  user: Schema<"DetailedUserResponseDTO">;
  includeEditButton?: boolean;
  includeFollowButton?: boolean;
  isFollowing?: boolean;
  handleFollow?: () => void;
};

function ProfileHeader({ user, ...props }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  const [followTabOpen, setFollowTabOpen] = useState<
    "followers" | "following" | null
  >(null);

  useEffect(() => {
    setFollowingCount(user.following);
    setFollowersCount(user.followers);
  }, [user]);

  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(containerRef, () => setFollowTabOpen(null), "left");

  const basicUserInfo = useContext(basicProfileInfoContext);

  return (
    <div className="profile-header" ref={containerRef}>
      <div className="profile-picture-container">
        <img
          src={user.image ?? "/DefaultProfilePicture.png"}
          alt={`Profile picture of a user named ${user.name}`}
        />
      </div>

      <div className="username-container">
        <p className="nickname">{user.name}</p>
        <p className="username">{user.username}</p>
      </div>

      {props.includeEditButton && (
        <button
          className="edit-profile-btn"
          onClick={() => void navigate("settings")}
        >
          Edit profile
        </button>
      )}

      {props.includeFollowButton && (
        <button
          className="follow-btn"
          onClick={() => {
            if (!basicUserInfo) {
              navigate("/authentication");
              return;
            }

            props.handleFollow?.();
            setFollowersCount((x) => x + (props.isFollowing ? -1 : 1));
          }}
        >
          {props.isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      <div className="stats-container">
        <div className="followers-container">
          <button
            className="stat"
            onClick={() => setFollowTabOpen("followers")}
          >
            <span className="value">{followersCount}</span> followers
          </button>

          <p className="dot">●</p>

          <button
            className="stat"
            onClick={() => setFollowTabOpen("following")}
          >
            <span className="value">{followingCount}</span> following
          </button>
        </div>

        <div className="completed-workouts-container">
          <p className="stat">
            <span className="value">{user.totalCompletedWorkouts ?? 0}</span>{" "}
            completed workouts
          </p>
        </div>
      </div>

      <FollowContainer
        isOpen={followTabOpen !== null}
        onClose={() => void setFollowTabOpen(null)}
        followersOrFollowing={followTabOpen ?? "followers"}
      />
    </div>
  );
}

export default ProfileHeader;
