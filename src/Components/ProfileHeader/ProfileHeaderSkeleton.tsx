import "./ProfileHeader.scss";
import Icon from "../Icon/Icon";

export default function ProfileHeaderSkeleton() {
  return (
    <div className="profile-header">
      <div className="profile-picture-container"></div>
      <div className="user-information">
        <div className="username">
          <p>Loading...</p>
          <Icon className="settings-btn" name="gear" />
        </div>
        <div className="user-base-stats">
          <div className="stat-container">
            <div className="name">Workouts</div>
            <div className="value">{0}</div>
          </div>
          <div className="stat-container">
            <div className="name">Followers</div>
            <div className="value">{0}</div>
          </div>
          <div className="stat-container">
            <div className="name">Following</div>
            <div className="value">{0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
