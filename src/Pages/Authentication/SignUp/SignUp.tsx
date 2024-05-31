import "./SignUp.scss";
import InputField from "../../../Components/InputField/InputField";
import { useRef } from "react";

interface SignUpProps {
  isActive: boolean;
  onToggle: () => void;
}

function SignUp({ isActive, onToggle }: SignUpProps) {
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
          inputRef={emailField}
          placeholder="Name"
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
        <button>Sign up</button>
      </section>
    </div>
  );
}

export default SignUp;
