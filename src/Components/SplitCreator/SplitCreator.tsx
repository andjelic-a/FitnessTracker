import { useRef, useState } from "react";
import WindowFC from "../WindowWrapper/WindowFC";
import "./SplitCreator.scss";
import Icon from "../Icon/Icon";
import { Tooltip } from "react-tooltip";

const SplitCreator = WindowFC(({}, onClose) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isPublic, setIsPublic] = useState<boolean>(false);

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

  function handleSaveClick() {
    console.log("saved");
  }

  return (
    <div className="split-creator-container" ref={wrapperRef}>
      <div className="header">
        <input
          ref={titleInputRef}
          type="text"
          className="title"
          placeholder="Split title"
          maxLength={25}
        />

        <div className="buttons">
          <button
            className="split-visibility-toggle"
            onClick={() => setIsPublic(!isPublic)}
            data-tooltip-content={isPublic ? "Public" : "Private"}
            data-tooltip-id="split-visibility-tooltip"
            data-tooltip-place="left"
          >
            <Icon
              aria-hidden
              className="lock"
              name={isPublic ? "unlock" : "lock"}
            />

            <p aria-hidden={false} className="accessibility-only">
              {isPublic ? "Public" : "Private"}
            </p>

            <Tooltip id="split-visibility-tooltip" />
          </button>

          <button onClick={() => onClose()} className="discard-btn">
            <p>Discard</p>
          </button>

          <button onClick={handleSaveClick} className="save-btn">
            <p>Save</p>
            <Icon name="floppy-disk" />
          </button>
        </div>
      </div>

      <div className="description-container">
        <textarea
          id="description-input"
          ref={descriptionTextAreaRef}
          onChange={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          aria-labelledby="description-input-label"
        />

        <label
          htmlFor="description-input"
          className="description-input-label"
          id="description-input-label"
        >
          Split description
        </label>
      </div>
    </div>
  );
});

export default SplitCreator;
