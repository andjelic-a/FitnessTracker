import SettingsMenu from "../SettingsMenu";
import "./Authentication.scss";

type EditProfileProps = {
  visible: boolean;
  setIsEditProfileOpen: (isVisible: boolean) => void;
  setIsAuthenticationOpen: (isVisible: boolean) => void;
  setIsPrivacyOpen: (isVisible: boolean) => void;
  onClose: () => void;
};

export default function Authentication({ visible, onClose, setIsEditProfileOpen, setIsAuthenticationOpen, setIsPrivacyOpen }: EditProfileProps) {
  return (
    <div className={`authentication ${visible ? "authentication-show" : ""}`}>
      <SettingsMenu onClose={onClose} setIsEditProfileOpen={setIsEditProfileOpen} setIsAuthenticationOpen={setIsAuthenticationOpen} setIsPrivacyOpen={setIsPrivacyOpen}/>
      <div className="authentication-item">Sign in</div>
      <div className="authentication-item">Sign up</div>
    </div>
  );
}
