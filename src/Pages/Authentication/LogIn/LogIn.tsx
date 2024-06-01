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

    if (
      !emailField.current ||
      !emailField.current.value ||
      !ValidateEmail({ email: emailField.current.value })
    ) {
      emailContainer.current!.style.border = "1px solid #f43f3f";
      emailValid = false;
    } else {
      emailContainer.current!.style.border = "none";
    }

    if (
      !passwordField.current ||
      !passwordField.current.value ||
      !ValidatePassword({ password: passwordField.current.value })
    ) {
      passwordContainer.current!.style.border = "1px solid #f43f3f";
      passwordValid = false;
    } else {
      passwordContainer.current!.style.border = "none";
    }

    if (emailValid && passwordValid) {
      if (
        await login(emailField.current!.value, passwordField.current!.value)
      ) {
        navigate("/me");
      } else {
        console.log("Wrong email or password");
      }
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
