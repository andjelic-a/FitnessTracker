import { useState, useRef, useEffect, useContext } from "react";
import Icon from "../../../Components/Icon/Icon";
import InputField from "../../../Components/InputField/InputField";
import "./EditProfile.scss";
import compressImage from "../../../Data/ImageCompression";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import basicProfileInfoContext from "../../../Contexts/BasicProfileInfoContext";
import { Tooltip } from "react-tooltip";

export default function EditProfile() {
  const user = useContext(basicProfileInfoContext);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLTextAreaElement>(null);

  const [defaultUsernameValue, setDefaultUsernameValue] = useState<string>("");
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
    if (!user || loadedInitial.current) return;
    loadedInitial.current = true;

    sendAPIRequest("/api/user/{username}/detailed", {
      method: "get",
      parameters: {
        username: user.username,
      },
    })
      .then((response) => (response.code === "OK" ? response.content : null))
      .then((user) => {
        if (!user) return;

        setSelectedImage(user.image);
        setDefaultUsernameValue(user.username);
        setDefaultNameValue(user.name);
        setDefaultBioValue(user.bio);
      });
  }, []);

  async function handleSave() {
    if (isImageChanged.current) {
      sendAPIRequest("/api/user/image", {
        method: "patch",
        payload: {
          newImage: selectedImage,
        },
      }).then(
        (x) =>
          x.code === "No Content" &&
          void sessionStorage.setItem("revalidate-profile", "true")
      );

      isImageChanged.current = false;
    }

    if (
      nameInputRef.current &&
      nameInputRef.current.value.trim() !== defaultNameValue
    ) {
      sendAPIRequest("/api/user/name", {
        method: "patch",
        payload: {
          newName: nameInputRef.current.value.trim(),
        },
      }).then(
        (x) =>
          x.code === "No Content" &&
          void sessionStorage.setItem("revalidate-profile", "true")
      );

      setDefaultNameValue(nameInputRef.current.value.trim());
    }

    if (
      bioInputRef.current &&
      bioInputRef.current.value.trim() !== defaultBioValue
    ) {
      sendAPIRequest("/api/user/bio", {
        method: "patch",
        payload: {
          newBio: bioInputRef.current.value.trim(),
        },
      }).then(
        (x) =>
          x.code === "No Content" &&
          void sessionStorage.setItem("revalidate-profile", "true")
      );

      setDefaultBioValue(bioInputRef.current.value.trim());
    }
  }

  return (
    <div className="settings-tab edit-profile">
      <h3>Edit profile</h3>

      <div className="edit-profile-user-details">
        <div
          className={`edit-profile-image-container`}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
          onFocus={() => setIsImageHovered(true)}
          onBlur={() => setIsImageHovered(false)}
        >
          <div className={`edit-profile-image-trigger`}>
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
          <p className="edit-profile-user-details-info-username">
            @{defaultUsernameValue}
          </p>
          <p className="edit-profile-user-details-info-name">
            {defaultNameValue}
          </p>
        </div>

        <div className="edit-profile-user-details-button">
          <button
            className="edit-profile-image-remove"
            onClick={handleRemoveImage}
          >
            <Icon name="trash" />

            <p className="accessibility-only" aria-hidden={false}>
              Remove image
            </p>

            <Tooltip
              anchorSelect=".edit-profile-image-remove"
              delayShow={300}
              content="Remove image"
            />
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
          placeholder="Enter Name"
          inputRef={nameInputRef}
        />
      </div>

      <div className="edit-profile-bio">
        <h3>Bio</h3>
        <textarea
          name="bio"
          autoComplete="off"
          placeholder="Enter Bio"
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

      <div className="edit-profile-save-container">
        <button className="edit-profile-save" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
