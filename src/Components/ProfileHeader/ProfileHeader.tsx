import { Schema } from "../../Types/Endpoints/SchemaParser";
import "./ProfileHeader.scss";
import { useNavigate } from "react-router-dom";

type ProfileHeaderProps = {
  user: Schema<"DetailedUserResponseDTO">;
} & (
  | {
      includeEditButton: boolean;

      includeFollowButton?: never;
      isFollowing?: never;
      handleFollow?: never;
    }
  | {
      includeEditButton?: never;

      includeFollowButton: boolean;
      isFollowing: boolean;
      handleFollow: () => void;
    }
);

function ProfileHeader({ user, ...props }: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="profile-header">
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

      {"includeEditButton" in props && (
        <button
          className="edit-profile-btn"
          onClick={() => void navigate("settings")}
        >
          Edit profile
        </button>
      )}

      {"includeFollowButton" in props && (
        <button className="follow-btn" onClick={props.handleFollow}>
          {props.isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      <div className="stats-container">
        <div className="followers-container">
          <p className="stat">
            <span className="value">{user.followers}</span> followers
          </p>

          <p className="dot">●</p>

          <p className="stat">
            <span className="value">{user.following}</span> following
          </p>
        </div>

        <div className="completed-workouts-container">
          <p className="stat">
            <span className="value">{user.totalCompletedWorkouts ?? 0}</span>{" "}
            completed workouts
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
