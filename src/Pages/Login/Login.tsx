import { useEffect, useRef } from "react";
import { getIsLoggedIn, login } from "../../Data/User";
import { useNavigate } from "react-router-dom";
import InputField from "../../Components/InputField/InputField";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (getIsLoggedIn()) navigate("/me");
    console.log("check");
  }, [navigate]);

  const emailField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p>Login</p>
      <InputField
        placeholder="Email"
        iconName="envelope"
        onEnter={(enteredText) => console.log(enteredText)}
      />

      <InputField
        placeholder="Password"
        iconName="key"
        onEnter={(enteredText) => console.log(enteredText)}
      />
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
