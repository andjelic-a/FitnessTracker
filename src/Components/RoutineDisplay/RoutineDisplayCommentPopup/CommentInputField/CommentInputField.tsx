import { RefObject, useEffect, useRef, useState } from "react";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import "./CommentInputField.scss";
import Async from "../../../Async/Async";
import { getProfileCache } from "../../../../Pages/Profile/ProfileCache";

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
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const [isButtonContainerVisible, setIsButtonContainerVisible] =
    useState(true);

  useEffect(() => {
    setIsButtonContainerVisible(props.type !== "comment");
    if (props.type !== "comment") inputRef.current?.focus();

    inputRef.current?.setSelectionRange(
      inputRef.current?.value.length,
      inputRef.current?.value.length
    );
  }, [inputRef, props.type]);

  useEffect(updateSubmitBtnDisabledState, [isButtonContainerVisible]);

  function handleInputRefHeightChange() {
    if (!inputRef.current) return;

    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  }

  useEffect(handleInputRefHeightChange, [inputRef]);

  function handleSubmit() {
    if (!inputRef.current) return;

    onSubmit({
      comment: inputRef.current.value,
    });
    inputRef.current.value = "";
    setComment("");
  }

  function handleCancel() {
    if (inputRef.current) {
      inputRef.current.value = "";
      setComment("");
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
    <div className="comment-input-container">
      <div className="image-container">
        <Async await={getProfileCache()?.user!}>
          {(user) => {
            if (user.code !== "OK") return null;

            return (
              <img
                src={user.content.image ?? "/DefaultProfilePicture.png"}
                alt={`Profile picture of a user named ${user.content.name}`}
              />
            );
          }}
        </Async>
      </div>

      <div className="main">
        <div className="comment-textarea-container">
          <textarea
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
