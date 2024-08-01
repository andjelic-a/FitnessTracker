import "./SettingsMenu.scss";

export default function SettingsMenu() {
    return (
        <div className="settings-menu">
            <div className="settings-menu-item">Edit profile</div>
            <div className="settings-menu-item">Authentication</div>
            <div className="settings-menu-item">Privacy</div>
            <div className="settings-menu-item">Log out</div>
        </div>
    );
}