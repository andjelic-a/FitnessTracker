import { useState, useRef, useEffect } from "react";
import SettingsMenu from "../SettingsMenu";
import Icon from "../../Icon/Icon";
import InputField from "../../InputField/InputField";
import "./EditProfile.scss";
import {
  getProfileCache,
  setProfileCache,
} from "../../../Pages/Profile/ProfileCache";
import compressImage from "../../../Data/ImageCompression";
import sendAPIRequest from "../../../Data/SendAPIRequest";

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

  const imageInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLTextAreaElement>(null);

  const [defaultNameValue, setDefaultNameValue] = useState("");
  const [defaultBioValue, setDefaultBioValue] = useState("");

  const isImageChanged = useRef(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      isImageChanged.current = true;
    }
  };

  const loadedInitial = useRef(false);
  useEffect(() => {
    if (loadedInitial.current) return;

    loadedInitial.current = true;
    getProfileCache()?.user.then((cache) => {
      if (cache.code !== "OK") return;

      const user = cache.content;
      setSelectedImage(user.image);
      setDefaultNameValue(user.name);
      setDefaultBioValue(user.bio);
      setSelectedGender(user.gender === 0 ? "male" : "female");
    });
  }, []);

  async function handleSave() {
    const cache = getProfileCache();
    const cachedUserData = await cache?.user;
    const user = cachedUserData?.code === "OK" ? cachedUserData?.content : null;
    if (!user) return;

    if (isImageChanged.current) {
      const uncompressedImage = imageInputRef.current?.files?.[0];
      const compressedImage = uncompressedImage
        ? await compressImage(uncompressedImage)
        : null;

      sendAPIRequest("/api/user/me/image", {
        method: "patch",
        payload: {
          newImage: compressedImage,
        },
      });

      user.image = compressedImage;
      isImageChanged.current = false;
    }

    if (
      nameInputRef.current &&
      nameInputRef.current.value.trim() !== defaultNameValue
    ) {
      sendAPIRequest("/api/user/me/name", {
        method: "patch",
        payload: {
          newName: nameInputRef.current.value.trim(),
        },
      });

      user.name = nameInputRef.current.value.trim();
      setDefaultNameValue(nameInputRef.current.value.trim());
    }

    if (
      bioInputRef.current &&
      bioInputRef.current.value.trim() !== defaultBioValue
    ) {
      sendAPIRequest("/api/user/me/bio", {
        method: "patch",
        payload: {
          newBio: bioInputRef.current.value.trim(),
        },
      });

      user.bio = bioInputRef.current.value.trim();
      setDefaultBioValue(bioInputRef.current.value.trim());
    }

    setProfileCache({
      ...cache!,
      user: Promise.resolve({ code: "OK", content: user }),
    });
  }

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
              src={selectedImage || "/DefaultProfilePicture.png"}
              alt="Profile picture"
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
          <h3>Name</h3>
          <InputField
            maxLength={25}
            className="edit-profile-username-input"
            placeholder="Name"
            inputRef={nameInputRef}
            defaultValue={defaultNameValue}
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
            ref={bioInputRef}
            defaultValue={defaultBioValue}
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
          <button className="edit-profile-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
