import { useEffect, useRef } from "react";
import { getIsLoggedIn, login } from "../../Data/User";
import { useNavigate } from "react-router-dom";
import InputField from "../../Components/InputField/InputField";
import Resizer from "react-image-file-resizer";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (getIsLoggedIn()) navigate("/me");
    console.log("check");
  }, [navigate]);

  const emailField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

  const fileUploadRef = useRef<HTMLInputElement>(null);

  const resizeFile = (file: Blob): Promise<string> =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          if (typeof uri === "string") resolve(uri);
        },
        "base64"
      );
    });

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

      <input type="file" name="file-test" ref={fileUploadRef} />
      <button onClick={Test}>Try doing something idk</button>
    </div>
  );

  async function Test() {
    if (!fileUploadRef.current || !fileUploadRef.current.files) return;

    const file = fileUploadRef.current.files[0];
    const resizedFile = await resizeFile(file);

    console.log(resizedFile.split(","));
  }
}
