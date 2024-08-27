import SettingsMenu from "../SettingsMenu";
import InputField from "../../InputField/InputField";
import "./Authentication.scss";

type EditProfileProps = {
  visible: boolean;
  setIsEditProfileOpen: (isVisible: boolean) => void;
  setIsAuthenticationOpen: (isVisible: boolean) => void;
  setIsPrivacyOpen: (isVisible: boolean) => void;
  onClose: () => void;
};

export default function Authentication({
  visible,
  onClose,
  setIsEditProfileOpen,
  setIsAuthenticationOpen,
  setIsPrivacyOpen,
}: EditProfileProps) {
  return (
    <div className={`authentication ${visible ? "authentication-show" : ""}`}>
      <SettingsMenu
        onClose={onClose}
        setIsEditProfileOpen={setIsEditProfileOpen}
        setIsAuthenticationOpen={setIsAuthenticationOpen}
        setIsPrivacyOpen={setIsPrivacyOpen}
      />
      <div className="authentication-content">
        <h3>Authentication</h3>
        <div className="authentication-email">
          <p>Change Email</p>
          <InputField
            maxLength={50}
            className="authentication-email-input"
            placeholder="Old email"
          />
          <InputField
            maxLength={50}
            className="authentication-email-input"
            placeholder="New email"
          />
          <button className="authentication-button">Save</button>
        </div>
        <div className="authentication-password">
          <p>Change Password</p>
          <InputField
            maxLength={50}
            className="authentication-password-input"
            placeholder="Old password"
            password
          />
          <InputField
            maxLength={50}
            className="authentication-password-input"
            placeholder="New password"
            password
          />
          <button className="authentication-button">Save</button>
        </div>
      </div>
    </div>
  );
}
