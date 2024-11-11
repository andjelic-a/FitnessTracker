import InputField from "../../../Components/InputField/InputField";
import Icon from "../../../Components/Icon/Icon";
import "./Authentication.scss";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { useEffect, useRef, useState } from "react";
import { logout } from "../../../Data/User";
import { validateEmail, validatePassword } from "../../Authentication/Validate";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
  const oldEmailInputRef = useRef<HTMLInputElement>(null);
  const newEmailInputRef = useRef<HTMLInputElement>(null);

  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);

  const verificationCodeInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const [resendDelay, setResendDelay] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const sentInitialVerificationRequest = useRef(false);

  useEffect(() => {
    if (sentInitialVerificationRequest.current) return;
    sentInitialVerificationRequest.current = true;

    sendAPIRequest("/api/user/is-verified", {
      method: "get",
    }).then((response) => {
      //If response in not ok, meaning if something went wrong with the request or the user shouldn't even be seeing this screen (not logged in), do not let them ask for a verification code to avoid further problems
      setIsVerified(response.code !== "OK" || response.content.isVerified);
    });
  }, []);

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

    const response = await sendAPIRequest("/api/user/password", {
      method: "patch",
      payload: {
        newPassword: newPasswordInputRef.current.value.trim(),
        oldPassword: oldPasswordInputRef.current.value.trim(),
      },
    });

    if (response.code === "No Content") {
      await logout();
      sessionStorage.setItem("revalidate-main", "true");
      navigate(0);
    }
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

    const response = await sendAPIRequest("/api/user/email", {
      method: "patch",
      payload: {
        newEmail: newEmailInputRef.current.value.trim(),
        oldEmail: oldEmailInputRef.current.value.trim(),
      },
    });

    if (response.code === "No Content") {
      await logout(true);
      sessionStorage.setItem("revalidate-main", "true");
      navigate(0);
    }
  }

  async function handleResendVerificationCode() {
    if (resendDelay > 0) return;

    const response = await sendAPIRequest(
      "/api/user/resend-confirmation-email",
      {
        method: "post",
      }
    );

    if (response.code !== "Created") return;

    setResendDelay(60);
    const interval = setInterval(() => {
      setResendDelay((prev) => {
        if (prev === 1) clearInterval(interval);

        return prev - 1;
      });
    }, 1000);
  }

  async function handleResendVerifyEmail() {
    const code = verificationCodeInputRef.current?.value.trim();
    if (code?.length !== 36) return;

    const response = await sendAPIRequest("/api/user/confirm-email/{code}", {
      method: "patch",
      parameters: {
        code,
      },
    });

    if (response.code === "No Content") setIsVerified(true);
  }

  return (
    <div className="settings-tab authentication">
      <h3>Authentication</h3>

      {!isVerified && (
        <div className="authentication-email verification">
          <p>Your email has not been verified</p>

          <div className="input-container">
            <InputField
              maxLength={50}
              className="authentication-email-input"
              placeholder="Verification code"
              name="verificationCode"
              autoComplete="off"
              inputRef={verificationCodeInputRef}
            />

            <button
              className="authentication-button resend"
              onClick={handleResendVerificationCode}
              disabled={resendDelay > 0}
            >
              {"Resend" + (resendDelay > 0 ? ` (${resendDelay}s)` : "")}
            </button>
          </div>

          <button
            className="authentication-button verify"
            onClick={handleResendVerifyEmail}
          >
            Verify
          </button>
        </div>
      )}

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
              Use an Authenticator App as your two-factor authentication (2FA).
              When you sign in you’ll be asked to use the security code provided
              by your Authenticator App.
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
              two-factor authentication (2FA). The security code will be sent to
              the address associated with your account.
            </p>
          </div>
          <div className="authentication-2fa-button">
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
