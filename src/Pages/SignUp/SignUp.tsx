import "./SignUp.scss";
import InputField from "../../Components/InputField/InputField";
import { useRef } from "react";

function SignUp() {
    const emailField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

    return(
    <div className="login-page">
    <div className="auth-container">
      <section className="auth-heading">
        <label>Log in</label>
      </section>

      <section className="auth-inputs">
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

      <section className="auth-buttons">
        <button>
          Log in
        </button>
      </section>

      <SignUp />
    </div>
  </div>
    );
}

export default SignUp;
