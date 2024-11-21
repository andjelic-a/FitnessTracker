import React, { useRef, useState } from "react";
import { AnimatePresence, useIsPresent } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedLayout, { AnimatedLayoutVariants } from "./AnimatedLayout";
import ReactModal from "react-modal";
import FocusTrap from "focus-trap-react";
import "./WindowFC.scss";
import { createPortal } from "react-dom";

type WindowFCProps = {
  animationTriggers?: AnimatedLayoutVariants;
  closeConfirmationModal?: {
    children: (
      onCancel: () => void,
      onConfirm: () => void
    ) => React.JSX.Element;
    modalProps?: Omit<
      ReactModal.Props,
      "children" | "isOpen" | "portalClassName" | "onRequestClose"
    >;
  };
};

type CloseFunction = (force?: boolean) => void;

type WindowFCInnerComponent<T extends {}> = (
  props: T,
  windowProps: WindowFCInnerComponentProps
) => React.JSX.Element;

type WindowFCInnerComponentProps = {
  close: CloseFunction;
  setModalConfirmationOpeningCondition?: (condition: () => boolean) => void;
};

const WindowFC =
  <T extends {}>(
    component: WindowFCInnerComponent<T>,
    windowProps?: WindowFCProps
  ) =>
  (props: T) => {
    const exists = useIsPresent();
    const navigate = useNavigate();
    const handleClose = (force?: boolean) => {
      if (!exists) return;

      if (
        force ||
        !windowProps?.closeConfirmationModal ||
        !modalCondition?.current?.()
      )
        navigate(-1);
      else setIsModalOpen(true);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalCondition = useRef<(() => boolean) | undefined>(undefined);
    const setModalOpeningCondition = (condition: () => boolean): void =>
      void (modalCondition.current = condition);

    return (
      <>
        {createPortal(
          <FocusTrap
            paused={isModalOpen}
            focusTrapOptions={{
              fallbackFocus: document.body,
              escapeDeactivates: false,
            }}
          >
            <div
              className="window-wrapper"
              onClick={(e) => {
                if ((e.target as HTMLElement).className === "window-wrapper")
                  handleClose();
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleClose();
              }}
            >
              <AnimatedLayout variants={windowProps?.animationTriggers}>
                <AnimatePresence>
                  {component(props, {
                    close: handleClose,
                    setModalConfirmationOpeningCondition:
                      windowProps?.closeConfirmationModal
                        ? setModalOpeningCondition
                        : undefined,
                  })}
                </AnimatePresence>
              </AnimatedLayout>
            </div>
          </FocusTrap>,
          document.body
        )}

        {windowProps?.closeConfirmationModal && (
          <ReactModal
            isOpen={isModalOpen}
            {...windowProps.closeConfirmationModal.modalProps}
            portalClassName="modal-portal"
            onRequestClose={() => void setIsModalOpen(false)}
          >
            <FocusTrap
              focusTrapOptions={{
                allowOutsideClick: true,
                escapeDeactivates: false,
              }}
              autoFocus
            >
              <div>
                {windowProps.closeConfirmationModal.children(
                  () => void setIsModalOpen(false),
                  () => {
                    setIsModalOpen(false);
                    handleClose(true);
                  }
                )}
              </div>
            </FocusTrap>
          </ReactModal>
        )}
      </>
    );
  };

export default WindowFC;
