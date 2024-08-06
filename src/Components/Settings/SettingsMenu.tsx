import Icon from "../Icon/Icon";
import "./SettingsMenu.scss";

type SettingsMenuProps = {
    onClose: () => void;
};

export default function SettingsMenu({ onClose }: SettingsMenuProps) {

    return (
        <div className="settings-menu">
            <div className="settings-menu-item">Edit profile</div>
            <div className="settings-menu-item">Authentication</div>
            <div className="settings-menu-item">Privacy</div>
            <Icon className="edit-profile-close-icon" onClick={onClose} name="xmark" />
        </div>
    );
}
