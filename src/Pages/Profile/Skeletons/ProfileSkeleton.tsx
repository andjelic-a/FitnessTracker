import ActivityGridSkeleton from "../../../Components/ActivityGrid/ActivityGridSkeleton";
import ProfileHeaderSkeleton from "../../../Components/ProfileHeader/ProfileHeaderSkeleton";

export default function ProfileSkeleton() {
  return (
    <div className="profile-user-container">
      <ProfileHeaderSkeleton />

      <div className="profile-body">
        <ActivityGridSkeleton />
      </div>
    </div>
  );
}
