import "./ConfirmModalDialog.scss";
import ReactModal from "react-modal";
import React from "react";

type ConfirmModalDialog = {
  children: React.ReactNode;
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
};

export default function ConfirmModalDialog({
  children,
  isOpen,
  onConfirm,
  onDeny,
}: ConfirmModalDialog) {
  return (
    <ReactModal
      isOpen={isOpen}
      className={{
        afterOpen: "open",
        base: "confirm-deletion-modal",
        beforeClose: "closing",
      }}
      overlayClassName="overlay-confirm-deletion-modal"
      portalClassName="modal-portal"
      onRequestClose={onDeny}
      closeTimeoutMS={300}
      aria={{
        labelledby: "confirm-deletion-title",
        describedby: "confirm-deletion-text",
      }}
    >
      <h3 id="confirm-deletion-text">Confirmation Required</h3>

      <h2>{children}</h2>

      <div className="modal-buttons-container">
        <button
          onClick={() => {
            console.log("deny");
            onDeny();
          }}
        >
          No
        </button>

        <button onClick={onConfirm}>Yes</button>
      </div>
    </ReactModal>
  );
}
