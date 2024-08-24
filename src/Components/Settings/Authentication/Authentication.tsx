import SettingsMenu from "../SettingsMenu";
import "./Authentication.scss";

type EditProfileProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Authentication({ visible, onClose }: EditProfileProps) {
  return (
    <div className={`authentication ${visible ? "authentication-show" : ""}`}>
      <SettingsMenu onClose={onClose} />
      <div className="authentication-item">Sign in</div>
      <div className="authentication-item">Sign up</div>
    </div>
  );
}
