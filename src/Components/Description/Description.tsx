import "./Description.scss";
import { useRef, useEffect } from "react";

type DescriptionProps = {
  placeholder?: string;
  text?: string;
  isInputEnabled: boolean;
};

export default function Description({
  placeholder,
  text,
  isInputEnabled,
}: DescriptionProps) {
  const descriptionTextAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (descriptionTextAreaRef.current) {
      descriptionTextAreaRef.current.style.height = 'auto';
      descriptionTextAreaRef.current.style.height = `${descriptionTextAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div className="description-container">
      <div className="description">
        <label className="description-placeholder">{placeholder}</label>
        <textarea
          id="description-input"
          rows={1}
          ref={descriptionTextAreaRef}
          value={isInputEnabled ? text : text}
          onChange={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          aria-labelledby="description-input-label"
          disabled={!isInputEnabled}
        />
      </div>
    </div>
  );
}
