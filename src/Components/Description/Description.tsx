import "./Description.scss";
import { forwardRef, useEffect } from "react";

type DescriptionProps = {
  placeholder?: string;
  text?: string;
  isInputEnabled: boolean;
};

const Description = forwardRef<HTMLTextAreaElement, DescriptionProps>(
  ({ placeholder, text, isInputEnabled }: DescriptionProps, ref) => {
    useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.style.height = "auto";
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    }, [text, ref]);

    return (
      <div className="description-container">
        <div className="description">
          <label className="description-placeholder">{placeholder}</label>
          <textarea
            id="description-input"
            rows={1}
            ref={ref}
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
);

export default Description;