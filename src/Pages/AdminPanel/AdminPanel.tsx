import { useEffect, useState } from "react";
import "./AdminPanel.scss";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUserData, getIsLoggedIn } from "../../Data/User";

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const parts = token.split(".");
    if (parts.length !== 3) return;

    const payload = JSON.parse(window.atob(parts[1]));

    if (payload.role !== "Admin") return;

    getCurrentUserData()
      .then((user) => {
        console.log(user);

        if (!user) {
          navigate("/login");
          return;
        }

        setIsAdmin(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  if (!isAdmin) return null;

  return (
    <div>
      <Outlet />

      <Link className="admin-panel-link" to="exercises">
        Exercises
      </Link>
    </div>
  );
}
