import "./Authentication.scss";

type EditProfileProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Authentication({ visible }: EditProfileProps) {
  return (
    <div className={`authentication ${visible ? "authentication-show" : ""}`}>
      <div className="authentication-item">Sign in</div>
      <div className="authentication-item">Sign up</div>
    </div>
  );
}
