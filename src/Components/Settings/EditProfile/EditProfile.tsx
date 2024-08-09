import { useState } from "react";
import SettingsMenu from "../SettingsMenu";
import Icon from "../../Icon/Icon";
import InputField from "../../InputField/InputField";
import "./EditProfile.scss";

type EditProfileProps = {
  visible: boolean;
  onClose: () => void;
};

export default function EditProfile({ visible, onClose }: EditProfileProps) {
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <div className={`edit-profile ${visible ? "edit-profile-show" : ""}`}>
      <SettingsMenu onClose={onClose} />
      <div className="edit-profile-content">
        <h3>Edit profile</h3>
        <div className={`edit-profile-image`}>
          <div
            className={`edit-profile-image-trigger`}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <Icon
              className={`edit-profile-image-icon ${
                isImageHovered ? "edit-profile-image-icon-hovered" : ""
              }`}
              name="pen-to-square"
            />
          </div>
          <img
            className={`${isImageHovered ? "edit-profile-image-hovered" : ""}`}
            src="../../../../public/DefaultProfilePicture.png"
          />
        </div>
        <div className="edit-profile-username">
          <p>Username</p>
          <InputField className="edit-profile-username-input" placeholder="Username" />
        </div>
      </div>
    </div>
  );
}
