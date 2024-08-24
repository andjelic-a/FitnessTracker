import Icon from "../Icon/Icon";
import "./SettingsMenu.scss";

type SettingsMenuProps = {
    onClose: () => void;
    setIsEditProfileOpen: (isVisible: boolean) => void;
    setIsAuthenticationOpen: (isVisible: boolean) => void;
};

export default function SettingsMenu({ onClose, setIsEditProfileOpen, setIsAuthenticationOpen }: SettingsMenuProps) {

    const handleEditProfileClick = () => {
        setIsEditProfileOpen(true); // Opens the EditProfile component
        setIsAuthenticationOpen(false); // Close Authentication if it was open
    }

    const handleAuthenticationClick = () => {
        setIsAuthenticationOpen(true); // Opens the Authentication component
        setIsEditProfileOpen(false); // Close EditProfile if it was open
    }

    return (
        <div className="settings-menu">
            <div className="settings-menu-item" onClick={handleEditProfileClick}>Edit profile</div>
            <div className="settings-menu-item" onClick={handleAuthenticationClick}>Authentication</div>
            <div className="settings-menu-item">Privacy</div>
            <Icon className="edit-profile-close-icon" onClick={onClose} name="xmark" />
        </div>
    );
}
