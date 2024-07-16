import ActivityGridSkeleton from "../../../Components/ActivityGrid/ActivityGridSkeleton";
import ProfileHeaderSkeleton from "../../../Components/ProfileHeader/ProfileHeaderSkeleton";

export default function ProfileSkeleton() {
  return (
    <div
      className="profile-user-skeleton"
      style={{
        filter: "blur(2px)",
      }}
    >
      <div className="profile-user-container">
        <ProfileHeaderSkeleton />
        <button className="profile-edit-button">Edit Profile</button>
        <div className="profile-body">
          <ActivityGridSkeleton />
        </div>
      </div>
    </div>
  );
}
