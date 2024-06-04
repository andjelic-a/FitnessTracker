import { useRef, useState } from "react";
import { login } from "../../../Data/User";
import { useNavigate } from "react-router-dom";
import InputField from "../../../Components/InputField/InputField";
import "./LogIn.scss";
import SignUp from "../SignUp/SignUp.tsx";
import { ValidateEmail, ValidatePassword } from "../Validate";

export default function Login() {
  const navigate = useNavigate();

  const emailField = useRef<HTMLInputElement>(null);
  const emailContainer = useRef<HTMLDivElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);
  const passwordContainer = useRef<HTMLDivElement>(null);

  const [isLoginActive, setIsLoginActive] = useState(true);

  function handleLabelClick() {
    setIsLoginActive((prevState) => !prevState);
  }

  const handleLogin = async () => {
    let emailValid: boolean = true;
    let passwordValid: boolean = true;

    if (!ValidateEmail(emailField.current?.value)) {
      emailContainer.current!.classList.add("invalid");
      emailValid = false;
    } else {
      emailContainer.current!.classList.remove("invalid");
    }

    if (!ValidatePassword(passwordField.current?.value)) {
      passwordContainer.current!.classList.add("invalid");
      passwordValid = false;
    } else {
      passwordContainer.current!.classList.remove("invalid");
    }

    if (emailValid && passwordValid) {
      const success = await login(
        emailField.current!.value,
        passwordField.current!.value
      );
      if (success) navigate("/me");
    }
  };

  return (
    <div
      className={`login-container ${
        isLoginActive ? "login-active" : "login-not-active"
      }`}
    >
      <section className="login-heading">
        <label onClick={handleLabelClick}>Log in</label>
      </section>

      <section className="login-inputs">
        <InputField
          inputRef={emailField}
          containerRef={emailContainer}
          placeholder="Email"
          className="input-field"
          iconName="envelope"
          onEnter={(enteredText) => console.log(enteredText)}
        />

        <InputField
          inputRef={passwordField}
          containerRef={passwordContainer}
          placeholder="Password"
          className="input-field"
          iconName="key"
          onEnter={(enteredText) => console.log(enteredText)}
        />
      </section>

      <section className="login-buttons">
        <button onClick={handleLogin}>Log in</button>
      </section>

      <SignUp isActive={!isLoginActive} onToggle={handleLabelClick} />
    </div>
  );
}
