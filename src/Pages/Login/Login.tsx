import { useEffect, useRef } from "react";
import { getIsLoggedIn, login } from "../../Data/User";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const emailField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (getIsLoggedIn()) navigate("/me");
    console.log("check");
  }, [navigate]);

  return (
    <div>
      <p>Login</p>
      <input type="text" ref={emailField} />
      <input type="password" ref={passwordField} />
      <button
        onClick={async () => {
          if (
            !emailField.current ||
            !passwordField.current ||
            !emailField.current.value ||
            !passwordField.current.value
          )
            return;

          if (
            await login(emailField.current.value, passwordField.current.value)
          )
            navigate("/me");
        }}
      >
        Login
      </button>
    </div>
  );
}
