import { useState, useRef, useEffect } from "react";
import Icon from "../../../Components/Icon/Icon";
import InputField from "../../../Components/InputField/InputField";
import "./EditProfile.scss";
import { getProfileCache, setProfileCache } from "../../Profile/ProfileCache";
import compressImage from "../../../Data/ImageCompression";
import sendAPIRequest from "../../../Data/SendAPIRequest";

export default function EditProfile() {
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

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const compressedImage = await compressImage(file);
    setSelectedImage(compressedImage);
    isImageChanged.current = true;
  }

  function handleRemoveImage() {
    setSelectedImage(null);
    isImageChanged.current = true;
  }

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
      sendAPIRequest("/api/user/me/image", {
        method: "patch",
        payload: {
          newImage: selectedImage,
        },
      });

      user.image = selectedImage;
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
    <div className="settings-tab edit-profile">
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
            className={`${isImageHovered ? "edit-profile-image-hovered" : ""}`}
            src={selectedImage || "/DefaultProfilePicture.png"}
            alt="Profile picture"
          />
        </div>

        <div className="edit-profile-user-details-info">
          <p>@username</p>
          <p className="edit-profile-user-details-info-name">name</p>
        </div>

        <div className="image-buttons-container">
          <button onClick={() => imageInputRef.current?.click()}>
            Change image
          </button>

          <button
            className="edit-profile-image-remove"
            onClick={handleRemoveImage}
          >
            <Icon name="trash" />

            <p className="accessibility-only" aria-hidden={false}>
              Remove image
            </p>
          </button>
        </div>
      </div>

      <div className="edit-profile-username">
        <h3>Name</h3>
        <InputField
          name="name"
          autoComplete="off"
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
          name="bio"
          autoComplete="off"
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
  );
}
