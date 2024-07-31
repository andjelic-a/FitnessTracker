import { useNavigate } from "react-router-dom";
import WindowFC from "../../Components/WindowWrapper/WindowFC";
import "./Settings.scss";

const Settings = WindowFC(({}, wrapperRef) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div ref={wrapperRef}>
      <div className="settings">
        <div className="settings-item">Edit profile</div>
        <div className="settings-item">Authentication</div>
        <div className="settings-item">Privacy</div>
        <div className="settings-item">Log out</div>
        <div className="settings-item" onClick={handleCancel}>Cancel</div>
      </div>
    </div>
  );
});

export default Settings;
