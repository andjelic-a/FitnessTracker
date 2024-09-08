import { memo, useEffect, useRef, useState } from "react";
import "./AppHeader.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import Async from "../Async/Async";
import Icon from "../Icon/Icon";
import { Link } from "react-router-dom";

const AppHeader = memo(() => {
  const [profilePictureRequest, setProfilePictureRequest] =
    useState<Promise<Schema<"UserProfilePictureResponseDTO"> | null> | null>(
      null
    );

  const sentRequest = useRef(false);

  useEffect(() => {
    if (sentRequest.current) return;

    sentRequest.current = true;
    setProfilePictureRequest(
      sendAPIRequest("/api/user/me/profilepicture", {
        method: "get",
      }).then((x) => (x.code === "OK" ? x.content : null))
    );
  }, []);

  return (
    <div className="app-header">
      <Link to="/">
        <h1 id="site-title">Fitness Tracker</h1>
      </Link>

      {profilePictureRequest && (
        <Async await={profilePictureRequest}>
          {(profilePicture) => {
            if (!profilePicture) return null;

            return (
              <div className="profile-picture-container">
                {profilePicture !== null ? (
                  <Link to="/me">
                    <img
                      src={profilePicture.image ?? "/DefaultProfilePicture.png"}
                      alt="Profile picture of the logged in user"
                    />
                  </Link>
                ) : (
                  <Link to="/authentication">
                    <Icon name="user" />
                  </Link>
                )}
              </div>
            );
          }}
        </Async>
      )}
    </div>
  );
});

export default AppHeader;
