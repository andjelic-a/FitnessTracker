import Icon from "../Icon/Icon";
import "./ProfileHeader.scss";

type ProfileHeaderProps = {
    username: string;
    image: string | null;
    workouts: number;
    followers: number;
    following: number;
};

function ProfileHeader({username, image, workouts, followers, following}: ProfileHeaderProps) {
  return (
    <div className="profile-header">
      <div className="profile-picture">
        <img src={image??"../../../public/DefaultProfilePicture.png"} alt="Profile Picture" />
      </div>
      <div className="profile-user-information">
        <div className="profile-user-username">
          <p>{username}</p>
          <Icon className="profile-user-settings" id="solid" name="gear" />
        </div>
        <div className="profile-user-stats">
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Workouts</div>
            <div className="profile-user-stats-num">{workouts}</div>
          </div>
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Followers</div>
            <div className="profile-user-stats-num">{followers}</div>
          </div>
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Following</div>
            <div className="profile-user-stats-num">{following}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
