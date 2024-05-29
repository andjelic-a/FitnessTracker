import { useEffect, useRef } from "react";
import { getIsLoggedIn, login } from "../../Data/User";
import { useNavigate } from "react-router-dom";
import InputField from "../../Components/InputField/InputField";
import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (getIsLoggedIn()) navigate("/me");
    console.log("check");
  }, [navigate]);

  const emailField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

  return (
    <div className="auth-container">
      <section className="auth-heading">
        <h3>Register</h3>
      </section>

      <section className="auth-inputs">
        <InputField
          inputRef={emailField}
          placeholder="Email"
          iconName="envelope"
          onEnter={(enteredText) => console.log(enteredText)}
        />

        <InputField
          inputRef={passwordField}
          placeholder="Password"
          iconName="key"
          onEnter={(enteredText) => console.log(enteredText)}
        />
      </section>

      <section className="auth-buttons">
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
          Sign in
        </button>
      </section>
    </div>
  );
}
