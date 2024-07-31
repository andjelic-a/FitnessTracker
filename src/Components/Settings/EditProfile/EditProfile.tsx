import Icon from "../../Icon/Icon";
import "./EditProfile.scss";

type EditProfileProps = {
  visible: boolean;
  onClose: () => void;
};

export default function EditProfile({ visible, onClose }: EditProfileProps) {
  return (
    <div className={`edit-profile ${visible ? "edit-profile-show" : ""}`}>
      <div className="edit-profile-content">
        <div className="edit-profile-header">
          <Icon onClick={onClose} name="xmark" />
        </div>
      </div>
    </div>
  );
}
