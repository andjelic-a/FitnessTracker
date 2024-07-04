import { useRef } from "react";
import InputField from "../../Components/InputField/InputField";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { useParams } from "react-router-dom";

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { code } = useParams();

  return (
    <div>
      <h1>Forgot Password</h1>
      <InputField placeholder="Email" inputRef={emailRef} />
      <InputField placeholder="New Password" password inputRef={passwordRef} />

      <button
        onClick={() => {
          sendAPIRequest("/api/user/me/forgotpassword/{code}", {
            method: "patch",
            parameters: {
              code: code ?? "",
            },
            payload: {
              email: emailRef.current!.value,
              newPassword: passwordRef.current!.value,
            },
          });
        }}
      >
        Submit
      </button>
    </div>
  );
}
