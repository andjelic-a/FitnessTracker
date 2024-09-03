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
        <div className="authentication-2fa">
          <h3>Two-Factor Authentication</h3>
          <p>
            Two-factor authentication (2FA) can be used to help protect your
            account from unauthorized access. You’ll be required to enter a
            security code each time you sign in.
          </p>
          <div className="authentication-2fa-container">
            <div className="authentication-2fa-text-area">
              <h3>Two-Factor Authenticator App</h3>
              <p>
                Use an Authenticator App as your two-factor authentication
                (2FA). When you sign in you’ll be asked to use the security code
                provided by your Authenticator App.
              </p>
            </div>
          </div>
          <div className="authentication-2fa-container">
            <div className="authentication-2fa-icon">
            </div>
            <div className="authentication-2fa-text-area">
              <h3>E-mail For Two-Factor Authenticator</h3>
              <p>
                Use the security code sent to your email address as your
                two-factor authentication (2FA). The security code will be sent
                to the address associated with your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
