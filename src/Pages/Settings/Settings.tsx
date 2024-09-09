import React, { useState, useEffect, useMemo } from "react";
import WindowFC from "../../Components/WindowWrapper/WindowFC";
import EditProfile from "../../Components/Settings/EditProfile/EditProfile";
import Authentication from "../../Components/Settings/Authentication/Authentication";
import Privacy from "../../Components/Settings/Privacy/Privacy";
import { logout } from "../../Data/User";
import "./Settings.scss";
import {
  createHtmlPortalNode,
  HtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";

type SettingsTab = "edit" | "auth" | "privacy";
const Settings = WindowFC(({}, wrapperRef, close) => {
  const [openTab, setOpenTab] = useState<SettingsTab>("edit");

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

    const menuItems = document.querySelectorAll(
      ".settings-item"
    ) as NodeListOf<HTMLDivElement>;

    menuItems.forEach((item) => {
      if (item) {
        item.addEventListener("mousemove", handleMouseMove);
        item.addEventListener("mouseleave", handleMouseLeave);
      }
    });

    return () => {
      menuItems.forEach((item) => {
        if (item) {
          item.removeEventListener("mousemove", handleMouseMove);
          item.removeEventListener("mouseleave", handleMouseLeave);
        }
      });
    };
  }, []);

  const tabNodes = useMemo<{
    [key in SettingsTab]: React.ReactNode;
  }>(
    () => ({
      edit: <EditProfile />,
      auth: <Authentication />,
      privacy: <Privacy />,
    }),
    []
  );

  const tabPortals = useMemo<{
    [key in SettingsTab]: HtmlPortalNode;
  }>(
    () => ({
      edit: createHtmlPortalNode(),
      auth: createHtmlPortalNode(),
      privacy: createHtmlPortalNode(),
    }),
    []
  );

  return (
    <div ref={wrapperRef} className="settings-container">
      <InPortal node={tabPortals["edit"]} children={tabNodes["edit"]} />
      <InPortal node={tabPortals["auth"]} children={tabNodes["auth"]} />
      <InPortal node={tabPortals["privacy"]} children={tabNodes["privacy"]} />

      <div className="settings">
        <div onClick={() => setOpenTab("edit")} className="settings-item">
          Edit profile
        </div>

        <div onClick={() => setOpenTab("auth")} className="settings-item">
          Authentication
        </div>

        <div className="settings-item" onClick={() => setOpenTab("privacy")}>
          Privacy
        </div>

        <div onClick={() => logout()} className="settings-item">
          Log out
        </div>

        <div onClick={() => close()} className="settings-item">
          Cancel
        </div>
      </div>

      <OutPortal node={tabPortals[openTab]} />
    </div>
  );
});

export default Settings;
