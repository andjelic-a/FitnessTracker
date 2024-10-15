import "./ConfirmModalDialog.scss";
import ReactModal from "react-modal";
import React from "react";
import FocusTrap from "focus-trap-react";

type ConfirmModalDialog = {
  children: React.ReactNode;
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
  confirmBtnText?: string;
  denyBtnText?: string;
};

export default function ConfirmModalDialog({
  children,
  isOpen,
  onConfirm,
  onDeny,
  confirmBtnText,
  denyBtnText,
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

      <FocusTrap>
        <div className="modal-buttons-container">
          <button onClick={onDeny}>{denyBtnText ?? "No"}</button>
          <button onClick={onConfirm}>{confirmBtnText ?? "Yes"}</button>
        </div>
      </FocusTrap>
    </ReactModal>
  );
}
