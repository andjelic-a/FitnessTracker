import { useState, useRef } from "react";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

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
            <input
             ref={imageInputRef}
              className="edit-profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <Icon
              className={`edit-profile-image-icon ${
                isImageHovered ? "edit-profile-image-icon-hovered" : ""
              }`}
              name="pen-to-square"
            />
          </div>
          <img
            className={`${isImageHovered ? "edit-profile-image-hovered" : ""}`}
            src={selectedImage || "../../../../public/DefaultProfilePicture.png"}
            alt="Profile"
          />
        </div>
        <div className="edit-profile-username">
          <p>Username</p>
          <InputField
            maxLength={25}
            className="edit-profile-username-input"
            placeholder="Username"
          />
        </div>
        <div className="edit-profile-bio">
          <p>Bio</p>
          <textarea
            placeholder="Bio"
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            maxLength={250}
            className="edit-profile-bio-textarea"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
