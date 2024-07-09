import "./ProfileHeader.scss";
import Icon from "../Icon/Icon";

type ProfileHeaderProps = {
  username: string;
  image: string | null;
  workouts: number;
  followers: number;
  following: number;
};

function ProfileHeader({
  username,
  image,
  workouts,
  followers,
  following,
}: ProfileHeaderProps) {
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
          <Icon className="profile-user-settings" name="gear" />
        </div>
        <div className="profile-user-stats">
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Workouts</div>
            <div className="profile-user-stats-num">{workouts ?? 0}</div>
          </div>
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Followers</div>
            <div className="profile-user-stats-num">{followers ?? 0}</div>
          </div>
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Following</div>
            <div className="profile-user-stats-num">{following ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
