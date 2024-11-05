import { useContext } from "react";
import "./AppHeader.scss";
import Icon from "../Icon/Icon";
import { Link } from "react-router-dom";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

function AppHeader() {
  const basicInfo = useContext(basicProfileInfoContext);

  return (
    <div className="app-header">
      <Link to="/">
        <h1 id="site-title">Fitness Tracker</h1>
      </Link>

      <div className="profile-picture-container">
        {basicInfo !== null ? (
          <Link to="/me">
            <img
              src={basicInfo.image ?? "/DefaultProfilePicture.png"}
              alt="Profile picture of the logged in user"
            />
          </Link>
        ) : (
          <Link to="/authentication">
            <Icon name="user" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default AppHeader;
