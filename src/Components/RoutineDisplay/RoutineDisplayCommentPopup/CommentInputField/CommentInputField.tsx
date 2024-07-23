import { useEffect, useRef } from "react";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import "./CommentInputField.scss";

type CommentInputFieldProps = {
  onSubmit: (comment: Schema<"CreateWorkoutCommentRequestDTO">) => void;
  onCancel?: () => void;
};

export default function CommentInputField({
  onSubmit,
  onCancel,
}: CommentInputFieldProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

    onCancel?.();
  }

  return (
    <div className="comment-input-container">
      <div className="comment-textarea-container">
        <textarea
          rows={1}
          ref={inputRef}
          onChange={handleInputRefHeightChange}
        />
      </div>

      <div className="workout-comment-header-button-wrapper">
        <button onClick={handleCancel}>
          <p>Cancel</p>
        </button>

        <button onClick={handleSubmit}>
          <p>Comment</p>
        </button>
      </div>
    </div>
  );
}
