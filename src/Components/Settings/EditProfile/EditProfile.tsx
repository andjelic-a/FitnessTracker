import { useState, useRef } from "react";
import SettingsMenu from "../SettingsMenu";
import Icon from "../../Icon/Icon";
import InputField from "../../InputField/InputField";
import "./EditProfile.scss";

type EditProfileProps = {
  visible: boolean;
  setIsEditProfileOpen: (isVisible: boolean) => void;
  setIsAuthenticationOpen: (isVisible: boolean) => void;
  setIsPrivacyOpen: (isVisible: boolean) => void;
  onClose: () => void;
};

export default function EditProfile({
  visible,
  onClose,
  setIsEditProfileOpen,
  setIsAuthenticationOpen,
  setIsPrivacyOpen,
}: EditProfileProps) {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<
    "male" | "none" | "female"
  >("none");

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
      <SettingsMenu
        onClose={onClose}
        setIsEditProfileOpen={setIsEditProfileOpen}
        setIsAuthenticationOpen={setIsAuthenticationOpen}
        setIsPrivacyOpen={setIsPrivacyOpen}
      />
      <div className="edit-profile-content">
        <h3>Edit profile</h3>
        <div className="edit-profile-user-details">
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
              className={`${
                isImageHovered ? "edit-profile-image-hovered" : ""
              }`}
              src={
                selectedImage || "../../../../public/DefaultProfilePicture.png"
              }
              alt="Profile"
            />
          </div>
          <div className="edit-profile-user-details-info">
            <p>@username</p>
            <p className="edit-profile-user-details-info-name">name</p>
          </div>
          <button onClick={() => imageInputRef.current?.click()}>
            Change image
          </button>
        </div>
        <div className="edit-profile-username">
          <h3>Username</h3>
          <InputField
            maxLength={25}
            className="edit-profile-username-input"
            placeholder="Username"
          />
        </div>
        <div className="edit-profile-username">
          <h3>Name</h3>
          <InputField
            maxLength={25}
            className="edit-profile-username-input"
            placeholder="Name"
          />
        </div>
        <div className="edit-profile-bio">
          <h3>Bio</h3>
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
        <div className="edit-profile-gender">
          <div
            className={`edit-profile-gender-background ${selectedGender}`}
          ></div>
          <div
            className={`edit-profile-gender-option`}
            onClick={() => setSelectedGender("male")}
          >
            <p>Male</p>
          </div>
          <div
            className={`edit-profile-gender-option`}
            onClick={() => setSelectedGender("none")}
          >
            <p>None</p>
          </div>
          <div
            className={`edit-profile-gender-option`}
            onClick={() => setSelectedGender("female")}
          >
            <p>Female</p>
          </div>
        </div>
        <div className="edit-profile-save-container">
          <button className="edit-profile-save">Save</button>
        </div>
      </div>
    </div>
  );
}
