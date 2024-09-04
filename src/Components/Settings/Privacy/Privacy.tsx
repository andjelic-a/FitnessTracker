import { useState } from "react";
import SettingsMenu from "../SettingsMenu";
import "./Privacy.scss";

type PrivacyProps = {
  visible: boolean;
  setIsEditProfileOpen: (isVisible: boolean) => void;
  setIsAuthenticationOpen: (isVisible: boolean) => void;
  setIsPrivacyOpen: (isVisible: boolean) => void;
  onClose: () => void;
};

export default function Privacy({
  visible,
  onClose,
  setIsEditProfileOpen,
  setIsAuthenticationOpen,
  setIsPrivacyOpen,
}: PrivacyProps) {
  const [isFollowingDisabled, setIsFollowingDisabled] = useState(false);

  return (
    <div className={`privacy ${visible ? "privacy-show" : ""}`}>
      <SettingsMenu
        setIsEditProfileOpen={setIsEditProfileOpen}
        setIsAuthenticationOpen={setIsAuthenticationOpen}
        setIsPrivacyOpen={setIsPrivacyOpen}
        onClose={onClose}
      />
      <h3>Privacy</h3>
      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Following</h3>
            <div className={`privacy-container-status-indicator ${isFollowingDisabled && "status-indicator-disabled"}`}>{isFollowingDisabled ? "Private" : "Public"}</div>
          </div>
          <p>
            You have control over the visibility of your following list. You can
            choose to make it either public or private. If set to public, anyone
            who visits your profile can see the accounts you follow.If set to
            private, your following list will only be visible to you.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() => setIsFollowingDisabled(!isFollowingDisabled)}
          >
            <div
              className={`privacy-container-button-icon ${
                isFollowingDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isFollowingDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
