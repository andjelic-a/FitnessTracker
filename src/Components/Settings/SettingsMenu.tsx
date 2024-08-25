import Icon from "../Icon/Icon";
import "./SettingsMenu.scss";

type SettingsMenuProps = {
    onClose: () => void;
    setIsEditProfileOpen: (isVisible: boolean) => void;
    setIsAuthenticationOpen: (isVisible: boolean) => void;
    setIsPrivacyOpen: (isVisible: boolean) => void;
};

export default function SettingsMenu({ onClose, setIsEditProfileOpen, setIsAuthenticationOpen, setIsPrivacyOpen }: SettingsMenuProps) {

    const handleEditProfileClick = () => {
        setIsEditProfileOpen(true);
        setIsAuthenticationOpen(false);
        setIsPrivacyOpen(false);
    }

    const handleAuthenticationClick = () => {
        setIsAuthenticationOpen(true);
        setIsEditProfileOpen(false);
        setIsPrivacyOpen(false);
    }

    const handlePrivacyClick = () => {
        setIsPrivacyOpen(true);
        setIsAuthenticationOpen(false);
        setIsEditProfileOpen(false);
    }

    return (
        <div className="settings-menu">
            <div className="settings-menu-item" onClick={handleEditProfileClick}>Edit profile</div>
            <div className="settings-menu-item" onClick={handleAuthenticationClick}>Authentication</div>
            <div className="settings-menu-item" onClick={handlePrivacyClick}>Privacy</div>
            <Icon className="edit-profile-close-icon" onClick={onClose} name="xmark" />
        </div>
    );
}
