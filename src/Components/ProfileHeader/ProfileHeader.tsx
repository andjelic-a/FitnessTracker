import "./ProfileHeader.scss";
import Icon from "../Icon/Icon";
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
  setFollowersOrFollowing,
}: ProfileHeaderProps) {
  const handleFollowersOrFollowingClick = (type: "followers" | "following") =>
    void setFollowersOrFollowing(type);
  const navigate = useNavigate();

  return (
    <div className="profile-header">
      <div className="profile-picture">
        <img
          src={image ?? "/DefaultProfilePicture.png"}
          alt={`Profile picture of a user named ${username}`}
        />
      </div>
      <div className="profile-user-information">
        <div className="profile-user-username">
          <p>{username}</p>
          <Icon
            className="profile-user-settings"
            name="gear"
            onClick={() => void navigate("settings")}
          />
        </div>
        <div className="profile-user-stats">
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Workouts</div>
            <div className="profile-user-stats-num">{workouts ?? 0}</div>
          </div>
          <div
            className="profile-user-stats-stat"
            onClick={() => handleFollowersOrFollowingClick("followers")}
          >
            <div className="profile-user-stats-name">Followers</div>
            <div className="profile-user-stats-num">{followers ?? 0}</div>
          </div>
          <div
            className="profile-user-stats-stat"
            onClick={() => handleFollowersOrFollowingClick("following")}
          >
            <div className="profile-user-stats-name">Following</div>
            <div className="profile-user-stats-num">{following ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
