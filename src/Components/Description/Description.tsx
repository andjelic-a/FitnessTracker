import "./Description.scss";
import { forwardRef, useEffect, useRef } from "react";

type DescriptionProps = {
  placeholder?: string;
  text?: string;
  isInputEnabled: boolean;
};

const Description = forwardRef<HTMLTextAreaElement, DescriptionProps>(
  ({ placeholder, text, isInputEnabled }: DescriptionProps, ref) => {
    const localRef = useRef<HTMLTextAreaElement | null>(null);

    const textareaRef = ref || localRef;

    useEffect(() => {
      const textarea =
        textareaRef instanceof Function ? null : textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [text]);

    return (
      <div className="description-container">
        <div className="description">
          <label className="description-placeholder" htmlFor="description-input">{placeholder}</label>

          <textarea
            id="description-input"
            rows={1}
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              if (isInputEnabled) {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }
            }}
            disabled={!isInputEnabled}
          />
        </div>
      </div>
    );
  }
);

export default Description;
