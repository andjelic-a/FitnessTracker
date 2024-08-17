import "./ProfileHeader.scss";
import { useNavigate } from "react-router-dom";

type ProfileHeaderProps = {
  username: string;
  image: string | null;
  workouts: number;
  followers: number;
  following: number;
  setFollowersOrFollowing: (type: "followers" | "following" | null) => void;
};

function ProfileHeader({
  username,
  image,
  workouts,
  followers,
  following,
}: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="profile-header">
      <div className="profile-picture-container">
        <img
          src={image ?? "/DefaultProfilePicture.png"}
          alt={`Profile picture of a user named ${username}`}
        />
      </div>

      <div className="username-container">
        <p className="nickname">{username}</p> {/*Todo: Add nickname*/}
        <p className="username">@{username}</p>
      </div>

      <button
        className="edit-profile-btn"
        onClick={() => void navigate("settings")}
      >
        Edit profile
      </button>

      <div className="stats-container">
        <div className="followers-container">
          <p className="stat">
            <span className="value">{followers}</span> followers
          </p>

          <p className="dot">●</p>

          <p className="stat">
            <span className="value">{following}</span> following
          </p>
        </div>

        <div className="completed-workouts-container">
          <p className="stat">
            <span className="value">{workouts ?? 0}</span> completed workouts
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
