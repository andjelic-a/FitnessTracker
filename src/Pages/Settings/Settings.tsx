import React, { useState, useEffect, useMemo } from "react";
import WindowFC from "../../Components/WindowWrapper/WindowFC";
import EditProfile from "./EditProfile/EditProfile";
import Authentication from "./Authentication/Authentication";
import Privacy from "./Privacy/Privacy";
import { logout } from "../../Data/User";
import "./Settings.scss";
import {
  createHtmlPortalNode,
  HtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import { useNavigate } from "react-router-dom";
import Icon from "../../Components/Icon/Icon";

type SettingsTab = "edit" | "auth" | "privacy";
const Settings = WindowFC(({}, { close }) => {
  const [openTab, setOpenTab] = useState<SettingsTab>("edit");
  const navigate = useNavigate();

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
      edit: createHtmlPortalNode({
        attributes: {
          class: "edit-profile-container",
        },
      }),
      auth: createHtmlPortalNode(),
      privacy: createHtmlPortalNode(),
    }),
    []
  );

  return (
    <div className="settings-container">
      <button onClick={() => close()} className="close-btn">
        <Icon name="xmark" />
      </button>

      <InPortal node={tabPortals["edit"]} children={tabNodes["edit"]} />
      <InPortal node={tabPortals["auth"]} children={tabNodes["auth"]} />
      <InPortal node={tabPortals["privacy"]} children={tabNodes["privacy"]} />

      <div className="settings-sidebar">
        <button onClick={() => setOpenTab("edit")} className="settings-item">
          Edit profile
        </button>

        <button onClick={() => setOpenTab("auth")} className="settings-item">
          Authentication
        </button>

        <button onClick={() => setOpenTab("privacy")} className="settings-item">
          Privacy
        </button>

        <button
          onClick={() => {
            logout().then(() => {
              sessionStorage.setItem("revalidate-main", "true");
              sessionStorage.setItem("revalidate-profile", "true");
              navigate("..");
            });
          }}
          className="settings-item"
        >
          Log out
        </button>

        <button
          onClick={() => close()}
          className="settings-item settings-item-cancel"
        >
          Cancel
        </button>
      </div>

      <OutPortal node={tabPortals[openTab]} />
    </div>
  );
});

export default Settings;
