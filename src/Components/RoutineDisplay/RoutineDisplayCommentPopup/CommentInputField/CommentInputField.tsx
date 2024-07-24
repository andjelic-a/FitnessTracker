import { useEffect, useRef, useState } from "react";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import "./CommentInputField.scss";
import Async from "../../../Async/Async";
import { getProfileCache } from "../../../../Pages/Profile/ProfileCache";

type CommentInputFieldProps = {
  type: "reply" | "comment";
  onSubmit: (comment: Schema<"CreateWorkoutCommentRequestDTO">) => void;
  onCancel?: () => void;
};

export default function CommentInputField({
  type,
  onSubmit,
  onCancel,
}: CommentInputFieldProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isButtonContainerVisible, setIsButtonContainerVisible] =
    useState(true);

  useEffect(() => {
    setIsButtonContainerVisible(type === "reply");

    if (type === "reply") inputRef.current?.focus();
  }, [inputRef, type]);

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
  }

  function handleCancel() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.blur();
    }

    if (type === "comment") setIsButtonContainerVisible(false);

    onCancel?.();
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
            placeholder={`Add a ${type}...`}
            className="new-comment-textarea"
            rows={1}
            ref={inputRef}
            onChange={handleInputRefHeightChange}
            onFocus={() => {
              if (type === "comment") setIsButtonContainerVisible(true);
            }}
          />
        </div>

        {isButtonContainerVisible && (
          <div className="workout-comment-header-button-wrapper">
            <button onClick={handleCancel}>
              <p>Cancel</p>
            </button>

            <button onClick={handleSubmit}>
              <p>Comment</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
