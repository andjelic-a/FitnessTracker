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

    if (
      !usernameField.current ||
      !usernameField.current.value ||
      !ValidateUsername({ username: usernameField.current.value })
    ) {
      usernameContainer.current!.style.border = "1px solid #ff0000";
      usernameValid = false;
    } else {
      usernameContainer.current!.style.border = "none";
    }

    if (
      !emailField.current ||
      !emailField.current.value ||
      !ValidateEmail({ email: emailField.current.value })
    ) {
      emailContainer.current!.style.border = "1px solid #ff0000";
      emailValid = false;
    } else {
      emailContainer.current!.style.border = "none";
    }

    if (
      !passwordField.current ||
      !passwordField.current.value ||
      !ValidatePassword({ password: passwordField.current.value })
    ) {
      passwordContainer.current!.style.border = "1px solid #ff0000";
      passwordValid = false;
    } else {
      passwordContainer.current!.style.border = "none";
    }
    if (emailValid && passwordValid) {
      if (
        await register(
          usernameField.current!.value,
          emailField.current!.value,
          passwordField.current!.value
        )
      )
        navigate("/me");
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
          onEnter={(enteredText: any) => console.log(enteredText)}
        />

        <InputField
          containerRef={emailContainer}
          inputRef={emailField}
          placeholder="Email"
          className="input-field"
          iconName="envelope"
          onEnter={(enteredText: any) => console.log(enteredText)}
        />

        <InputField
          containerRef={passwordContainer}
          inputRef={passwordField}
          placeholder="Password"
          className="input-field"
          iconName="key"
          onEnter={(enteredText: any) => console.log(enteredText)}
        />
      </section>

      <section className="signup-buttons">
        <button onClick={handleSignup}>Sign up</button>
      </section>
    </div>
  );
}

export default SignUp;
