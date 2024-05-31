import { useRef, useState } from "react";
import { login } from "../../../Data/User";
import { useNavigate } from "react-router-dom";
import InputField from "../../../Components/InputField/InputField";
import "./LogIn.scss";
import SignUp from "../SignUp/SignUp.tsx";

export default function Login() {
  const navigate = useNavigate();

  const emailField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

  const [isLoginActive, setIsLoginActive] = useState(true);

  function handleLabelClick() {
    setIsLoginActive((prevState) => !prevState);
  }

  return (
      <div className={`login-container ${isLoginActive ? "login-active" : "login-not-active"}`}>
        <section className="login-heading">
          <label onClick={handleLabelClick}>Log in</label>
        </section>

        <section className="login-inputs">
          <InputField
            inputRef={emailField}
            placeholder="Email"
            className="input-field"
            iconName="envelope"
            onEnter={(enteredText) => console.log(enteredText)}
          />

          <InputField
            inputRef={passwordField}
            placeholder="Password"
            className="input-field"
            iconName="key"
            onEnter={(enteredText) => console.log(enteredText)}
          />
        </section>

        <section className="login-buttons">
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
                await login(
                  emailField.current.value,
                  passwordField.current.value
                )
              )
                navigate("/me");
            }}
          >
            Log in
          </button>
        </section>

        <SignUp isActive={!isLoginActive} onToggle={handleLabelClick} />
      </div>
  );
}