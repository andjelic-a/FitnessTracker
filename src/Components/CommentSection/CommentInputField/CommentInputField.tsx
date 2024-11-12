import { Schema } from "../../../Types/Endpoints/SchemaParser";
import { RefObject, useContext, useEffect, useRef, useState } from "react";
import "./CommentInputField.scss";
import basicProfileInfoContext from "../../../Contexts/BasicProfileInfoContext";

type CommentInputFieldProps = {
  textAreaRef: RefObject<HTMLTextAreaElement>;
  onSubmit: (comment: Schema<"CreateWorkoutCommentRequestDTO">) => void;
  onCancel?: () => void;
} & (
  | {
      type: "reply" | "comment";
    }
  | {
      type: "nested-reply";
      replyingTo: Schema<"SimpleUserResponseDTO">;
    }
);

export default function CommentInputField({
  onSubmit,
  onCancel,
  textAreaRef: inputRef,
  ...props
}: CommentInputFieldProps) {
  const basicInfo = useContext(basicProfileInfoContext);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const [isButtonContainerVisible, setIsButtonContainerVisible] =
    useState(true);

  useEffect(() => {
    setIsButtonContainerVisible(props.type !== "comment");
    if (props.type !== "comment") inputRef.current?.focus();

    // inputRef.current?.setSelectionRange(
    //   inputRef.current?.value.length,
    //   inputRef.current?.value.length
    // );
  }, [inputRef, props.type]);

  useEffect(updateSubmitBtnDisabledState, [isButtonContainerVisible]);

  function handleInputRefHeightChange() {
    if (!inputRef.current) return;

    const height = inputRef.current.scrollHeight;

    inputRef.current.style.height = "auto";
    inputRef.current.style.height = height > 0 ? `${height}px` : "auto";
  }

  useEffect(handleInputRefHeightChange, [inputRef]);

  function handleSubmit() {
    if (!inputRef.current) return;

    onSubmit({
      comment: inputRef.current.value,
    });
    inputRef.current.value = "";
  }

  function handleCancel() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.blur();
    }

    if (props.type === "comment") setIsButtonContainerVisible(false);

    onCancel?.();
  }

  function updateSubmitBtnDisabledState() {
    if (!submitBtnRef.current || !inputRef.current) return;

    submitBtnRef.current.disabled =
      inputRef.current.value.trim().length <= 0 ||
      inputRef.current.value.trim() === inputRef.current.defaultValue.trim();
  }

  return (
    <div
      className={
        "comment-input-container" + (props.type === "comment" ? "" : " reply")
      }
    >
      <div className="image-container">
        <img
          src={basicInfo?.image ?? "/DefaultProfilePicture.png"}
          alt={`Your profile picture`}
        />
      </div>

      <div className="main">
        <div className="comment-textarea-container">
          <textarea
            disabled={basicInfo == null || !basicInfo.isVerified}
            placeholder={`Add a ${
              props.type === "comment" ? "comment" : "reply"
            }...`}
            className="new-comment-textarea"
            rows={1}
            ref={inputRef}
            onChange={() => {
              handleInputRefHeightChange();
              updateSubmitBtnDisabledState();
            }}
            onKeyDown={(e) => {
              if (
                props.type === "nested-reply" &&
                e.key === "Backspace" &&
                inputRef.current?.value === `@${props.replyingTo.name}`
              ) {
                e.preventDefault();
                inputRef.current.value = "";
              }
            }}
            defaultValue={
              props.type === "nested-reply" ? `@${props.replyingTo.name} ` : ""
            }
            onFocus={() => {
              if (props.type === "comment") setIsButtonContainerVisible(true);
            }}
          />
        </div>

        {isButtonContainerVisible && (
          <div className="comment-input-button-container">
            <button onClick={handleCancel}>
              <p>Cancel</p>
            </button>

            <button ref={submitBtnRef} onClick={handleSubmit}>
              <p>Comment</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
