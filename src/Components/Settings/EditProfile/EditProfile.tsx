import Icon from "../../Icon/Icon";
import SettingsMenu from "../SettingsMenu";
import "./EditProfile.scss";

type EditProfileProps = {
  visible: boolean;
  onClose: () => void;
};

export default function EditProfile({ visible, onClose }: EditProfileProps) {
  return (
    <div className={`edit-profile ${visible ? "edit-profile-show" : ""}`}>
      <SettingsMenu />
      <div className="edit-profile-content">
        <div className="edit-profile-header">
          <Icon className="edit-profile-close-icon" onClick={onClose} name="xmark" />
        </div>
      </div>
    </div>
  );
}
