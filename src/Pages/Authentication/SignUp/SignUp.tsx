import "./SignUp.scss";
import InputField from "../../../Components/InputField/InputField";
import { useRef } from "react";
import { register } from "../../../Data/User";
import { useNavigate } from "react-router-dom";

interface SignUpProps {
  isActive: boolean;
  onToggle: () => void;
}

function SignUp({ isActive, onToggle }: SignUpProps) {

  const navigate = useNavigate();

  const usernameField = useRef<HTMLInputElement>(null);
  const emailField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

  const class1 = "signup-container";
  const class2 = isActive ? "signup-active" : "signup-not-active";

  return (
    <div className={class1 + " " + class2}>
      <section className="signup-heading">
        <label onClick={onToggle}>Sign up</label>
      </section>

      <section className="signup-inputs">
        <InputField
          inputRef={usernameField}
          placeholder="Username"
          className="input-field"
          iconName="user"
          onEnter={(enteredText: any) => console.log(enteredText)}
        />

        <InputField
          inputRef={emailField}
          placeholder="Email"
          className="input-field"
          iconName="envelope"
          onEnter={(enteredText: any) => console.log(enteredText)}
        />

        <InputField
          inputRef={passwordField}
          placeholder="Password"
          className="input-field"
          iconName="key"
          onEnter={(enteredText: any) => console.log(enteredText)}
        />

      </section>

      <section className="signup-buttons">
        <button
        onClick={async () => {
          if (
            !usernameField.current ||
            !emailField.current ||
            !passwordField.current ||
            !emailField.current.value ||
            !passwordField.current.value ||
            !usernameField.current.value
          )
            return;

          if (
            await register(
              usernameField.current.value,
              emailField.current.value,
              passwordField.current.value
            )
          )
            navigate("/me");
        }}
        >
          Sign up
        </button>
      </section>
    </div>
  );
}

export default SignUp;
