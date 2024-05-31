import { useEffect } from "react";
import { getIsLoggedIn } from "../../Data/User";
import { useNavigate } from "react-router-dom";
import Login from "./LogIn/LogIn";
import "./Authentication.scss";

function Authentication() {
    const navigate = useNavigate();
  useEffect(() => {
    if (getIsLoggedIn()) navigate("/me");
    console.log("check");
  }, [navigate]);

    return <div className="auth-page">
        <Login />
    </div>;
}

export default Authentication