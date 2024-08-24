import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WindowFC from "../../Components/WindowWrapper/WindowFC";
import EditProfile from "../../Components/Settings/EditProfile/EditProfile";
import Authentication from "../../Components/Settings/Authentication/Authentication";
import { logout } from "../../Data/User";
import "./Settings.scss";

const Settings = WindowFC(({}, wrapperRef) => {
  const navigate = useNavigate();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isAuthenticationOpen, setIsAuthenticationOpen] = useState<boolean>(false);

  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  const setMenuItemRef = useCallback((element: HTMLDivElement | null) => {
    if (element && !menuItemsRef.current.includes(element)) {
      menuItemsRef.current.push(element);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const { left, top, width, height } = target.getBoundingClientRect();
      const xPos = ((event.clientX - left) / width) * 100;
      const yPos = ((event.clientY - top) / height) * 100;
      target.style.background = `radial-gradient(circle at ${xPos}% ${yPos}%, #444444, #2e2e2e 100%)`;
    };

    const handleMouseLeave = (event: MouseEvent) => {
      (event.target as HTMLElement).style.background = "";
    };

    menuItemsRef.current.forEach(item => {
      if (item) {
        item.addEventListener("mousemove", handleMouseMove);
        item.addEventListener("mouseleave", handleMouseLeave);
      }
    });

    return () => {
      menuItemsRef.current.forEach(item => {
        if (item) {
          item.removeEventListener("mousemove", handleMouseMove);
          item.removeEventListener("mouseleave", handleMouseLeave);
        }
      });
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <EditProfile visible={isEditProfileOpen} setIsEditProfileOpen={setIsEditProfileOpen} setIsAuthenticationOpen={setIsAuthenticationOpen} onClose={handleCloseEditProfile} />
      <Authentication visible={isAuthenticationOpen} setIsEditProfileOpen={setIsEditProfileOpen} setIsAuthenticationOpen={setIsAuthenticationOpen} onClose={() => setIsAuthenticationOpen(false)} />
      <div className="settings">
        <div ref={setMenuItemRef} onClick={() => setIsEditProfileOpen(prevState => !prevState)} className="settings-item">Edit profile</div>
        <div ref={setMenuItemRef} onClick={() => setIsAuthenticationOpen(prevState => !prevState)} className="settings-item">Authentication</div>
        <div ref={setMenuItemRef} className="settings-item">Privacy</div>
        <div ref={setMenuItemRef} onClick={logout} className="settings-item">Log out</div>
        <div ref={setMenuItemRef} onClick={handleCancel} className="settings-item">Cancel</div>
      </div>
    </div>
  );
});

export default Settings;
