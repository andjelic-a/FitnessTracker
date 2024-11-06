import "./Description.scss";
import { useRef } from "react";

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

    const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="description-container">
      <div className="description">
        <label className="description-placeholder">{placeholder}</label>
        {isInputEnabled ? (
          <textarea
            id="description-input"
            ref={descriptionTextAreaRef}
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            rows={1}
            aria-labelledby="description-input-label"
          ></textarea>
        ) : (
          text
        )}
      </div>
    </div>
  );
}
