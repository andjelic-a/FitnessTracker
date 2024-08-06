import SettingsMenu from "../SettingsMenu";
import "./EditProfile.scss";

type EditProfileProps = {
  visible: boolean;
  onClose: () => void;
};

export default function EditProfile({ visible, onClose }: EditProfileProps) {
  return (
    <div className={`edit-profile ${visible ? "edit-profile-show" : ""}`}>
      <SettingsMenu onClose={onClose} />
      <div className="edit-profile-content">
      </div>
    </div>
  );
}
