import "./ProfileHeader.scss";
import Icon from "../Icon/Icon";

export default function ProfileHeaderSkeleton() {
  return (
    <div className="profile-header">
      <div className="profile-picture"></div>
      <div className="profile-user-information">
        <div className="profile-user-username">
          <p>Loading...</p>
          <Icon className="profile-user-settings" name="gear" />
        </div>
        <div className="profile-user-stats">
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Workouts</div>
            <div className="profile-user-stats-num">{0}</div>
          </div>
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Followers</div>
            <div className="profile-user-stats-num">{0}</div>
          </div>
          <div className="profile-user-stats-stat">
            <div className="profile-user-stats-name">Following</div>
            <div className="profile-user-stats-num">{0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
