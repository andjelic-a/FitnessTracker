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
        <div className="profile-body"></div>
      </div>
    </div>
  );
}
