import InputField from "../../InputField/InputField";
import Icon from "../../Icon/Icon";
import "./Authentication.scss";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { useRef } from "react";
import { logout } from "../../../Data/User";
import {
  validateEmail,
  validatePassword,
} from "../../../Pages/Authentication/Validate";

export default function Authentication() {
  const oldEmailInputRef = useRef<HTMLInputElement>(null);
  const newEmailInputRef = useRef<HTMLInputElement>(null);

  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);

  async function handlePasswordChangeSave() {
    if (
      !oldPasswordInputRef.current ||
      !newPasswordInputRef.current ||
      !validatePassword(oldPasswordInputRef.current.value.trim()) ||
      !validatePassword(newPasswordInputRef.current.value.trim()) ||
      oldPasswordInputRef.current.value.trim() ===
        newPasswordInputRef.current.value.trim()
    )
      return;

    const response = await sendAPIRequest("/api/user/me/password", {
      method: "patch",
      payload: {
        newPassword: newPasswordInputRef.current.value.trim(),
        oldPassword: oldPasswordInputRef.current.value.trim(),
      },
    });

    if (response.code === "No Content") await logout();
  }

  async function handleEmailChangeSave() {
    if (
      !oldEmailInputRef.current ||
      !newEmailInputRef.current ||
      !validateEmail(oldEmailInputRef.current.value.trim()) ||
      !validateEmail(newEmailInputRef.current.value.trim()) ||
      oldEmailInputRef.current.value.trim() ===
        newEmailInputRef.current.value.trim()
    )
      return;

    const response = await sendAPIRequest("/api/user/me/email", {
      method: "patch",
      payload: {
        newEmail: newEmailInputRef.current.value.trim(),
        oldEmail: oldEmailInputRef.current.value.trim(),
      },
    });

    if (response.code === "No Content") await logout(true);
  }

  return (
    <div className="authentication">
      <div className="authentication-content">
        <h3>Authentication</h3>
        <div className="authentication-email">
          <p>Change Email</p>
          <InputField
            maxLength={50}
            className="authentication-email-input"
            placeholder="Old email"
            name="oldEmail"
            autoComplete="off"
            inputRef={oldEmailInputRef}
          />
          <InputField
            maxLength={50}
            className="authentication-email-input"
            placeholder="New email"
            name="newEmail"
            autoComplete="off"
            inputRef={newEmailInputRef}
          />
          <button
            className="authentication-button"
            onClick={handleEmailChangeSave}
          >
            Save
          </button>
        </div>
        <div className="authentication-password">
          <h3>Change Password</h3>
          <p>
            For your security, we highly recommend that you choose a unique
            password that you don't use for any other online account.
          </p>
          <InputField
            maxLength={50}
            className="authentication-password-input"
            placeholder="Old password"
            password
            name="oldPassword"
            autoComplete="off"
            inputRef={oldPasswordInputRef}
          />
          <InputField
            maxLength={50}
            className="authentication-password-input"
            placeholder="New password"
            password
            name="newPassword"
            autoComplete="off"
            inputRef={newPasswordInputRef}
          />
          <button
            className="authentication-button"
            onClick={handlePasswordChangeSave}
          >
            Save
          </button>
        </div>
        <div className="authentication-2fa">
          <h3>Two-Factor Authentication</h3>
          <p>
            Two-factor authentication (2FA) can be used to help protect your
            account from unauthorized access. You’ll be required to enter a
            security code each time you sign in.
          </p>
          <div className="authentication-2fa-container">
            <div className="authentication-2fa-icon-container">
              <Icon
                className="authentication-2fa-icon"
                name="mobile-screen-button"
              />
            </div>
            <div className="authentication-2fa-text-area">
              <h3>Two-Factor Authenticator App</h3>
              <p>
                Use an Authenticator App as your two-factor authentication
                (2FA). When you sign in you’ll be asked to use the security code
                provided by your Authenticator App.
              </p>
            </div>
            <div className="authentication-2fa-button">
              <button>Send</button>
            </div>
          </div>
          <div className="authentication-2fa-container">
            <div className="authentication-2fa-icon-container">
              <Icon className="authentication-2fa-icon" name="envelope" />
            </div>
            <div className="authentication-2fa-text-area">
              <h3>E-mail For Two-Factor Authenticator</h3>
              <p>
                Use the security code sent to your email address as your
                two-factor authentication (2FA). The security code will be sent
                to the address associated with your account.
              </p>
            </div>
            <div className="authentication-2fa-button">
              <button>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
