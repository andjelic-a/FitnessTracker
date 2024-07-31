import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WindowFC from "../../Components/WindowWrapper/WindowFC";
import EditProfile from "../../Components/Settings/EditProfile/EditProfile";
import "./Settings.scss";

const Settings = WindowFC(({}, wrapperRef) => {
  const navigate = useNavigate();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  return (
    <div ref={wrapperRef}>
      <EditProfile visible={isEditProfileOpen} onClose={handleCloseEditProfile} />
      <div className="settings">
        <div onClick={() => setIsEditProfileOpen(prevState => !prevState)} className="settings-item">Edit profile</div>
        <div className="settings-item">Authentication</div>
        <div className="settings-item">Privacy</div>
        <div className="settings-item">Log out</div>
        <div className="settings-item" onClick={handleCancel}>Cancel</div>
      </div>
    </div>
  );
});

export default Settings;
