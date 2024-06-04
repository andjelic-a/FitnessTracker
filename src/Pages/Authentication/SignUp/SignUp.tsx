import "./SignUp.scss";
import InputField from "../../../Components/InputField/InputField";
import { useRef } from "react";
import { register } from "../../../Data/User";
import { useNavigate } from "react-router-dom";
import { ValidateEmail, ValidatePassword, ValidateUsername } from "../Validate";

interface SignUpProps {
  isActive: boolean;
  onToggle: () => void;
}

function SignUp({ isActive, onToggle }: SignUpProps) {
  const navigate = useNavigate();

  const usernameField = useRef<HTMLInputElement>(null);
  const usernameContainer = useRef<HTMLDivElement>(null);
  const emailField = useRef<HTMLInputElement>(null);
  const emailContainer = useRef<HTMLDivElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);
  const passwordContainer = useRef<HTMLDivElement>(null);

  const class1 = "signup-container";
  const class2 = isActive ? "signup-active" : "signup-not-active";

  const handleSignup = async () => {
    let usernameValid: boolean = true;
    let emailValid: boolean = true;
    let passwordValid: boolean = true;

    if (!ValidateUsername(usernameField.current?.value)) {
      usernameContainer.current!.classList.add("invalid");
      usernameValid = false;
    } else {
      emailContainer.current!.classList.remove("invalid");
      usernameContainer.current!.style.border = "none";
    }

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

    if (usernameValid && emailValid && passwordValid) {
      const success = await register(
        usernameField.current!.value,
        emailField.current!.value,
        passwordField.current!.value
      );

      if (success) navigate("/me");
    }
  };

  return (
    <div className={class1 + " " + class2}>
      <section className="signup-heading">
        <label onClick={onToggle}>Sign up</label>
      </section>

      <section className="signup-inputs">
        <InputField
          containerRef={usernameContainer}
          inputRef={usernameField}
          placeholder="Username"
          className="input-field"
          iconName="user"
          onEnter={(enteredText) => {
            console.log(usernameField.current);

            if (ValidateUsername(enteredText)) {
              usernameContainer.current!.classList.remove("invalid");
              emailField.current?.focus();
            } else usernameContainer.current!.classList.add("invalid");
          }}
          name="signup-username"
        />

        <InputField
          containerRef={emailContainer}
          inputRef={emailField}
          placeholder="Email"
          className="input-field"
          iconName="envelope"
          onEnter={(enteredText) => {
            if (ValidateEmail(enteredText)) {
              emailContainer.current!.classList.remove("invalid");
              passwordField.current?.focus();
            } else emailContainer.current!.classList.add("invalid");
          }}
          name="signup-email"
        />

        <InputField
          containerRef={passwordContainer}
          inputRef={passwordField}
          placeholder="Password"
          className="input-field"
          iconName="key"
          onEnter={handleSignup}
          password
          name="signup-password"
        />
      </section>

      <section className="signup-buttons">
        <button onClick={handleSignup}>Sign up</button>
      </section>
    </div>
  );
}

export default SignUp;
