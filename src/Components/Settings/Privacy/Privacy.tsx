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
  return (
    <div className={`privacy ${visible ? "privacy-show" : ""}`}>
      <SettingsMenu setIsEditProfileOpen={setIsEditProfileOpen} setIsAuthenticationOpen={setIsAuthenticationOpen} setIsPrivacyOpen={setIsPrivacyOpen} onClose={onClose} />
      dsadasdasd
    </div>
  );
}
