import React, { RefObject, useEffect, useRef, useState } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import { AnimatePresence, useIsPresent } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedLayout, { AnimatedLayoutVariants } from "./AnimatedLayout";
import ReactModal from "react-modal";
import FocusTrap from "focus-trap-react";

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

const WindowFC =
  <T extends {}>(
    component: (
      props: T,
      wrapperRef: RefObject<HTMLDivElement>,
      close: (force?: boolean) => void,
      setModalConfirmationOpeningCondition?: (condition: () => boolean) => void
    ) => React.JSX.Element,
    windowProps?: WindowFCProps
  ) =>
  (props: T) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
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

    useOutsideClick(wrapperRef, handleClose, "left");

    useEffect(() => {
      function closeOnESC(event: KeyboardEvent) {
        if (event.key === "Escape") handleClose();
      }

      document.addEventListener("keydown", closeOnESC);
      return () => document.removeEventListener("keydown", closeOnESC);
    }, []);

    return (
      <>
        <FocusTrap
          paused={isModalOpen}
          focusTrapOptions={{
            fallbackFocus: document.body,
          }}
        >
          <div className="window-wrapper">
            <AnimatedLayout variants={windowProps?.animationTriggers}>
              <AnimatePresence>
                {component(
                  props,
                  wrapperRef,
                  handleClose,
                  windowProps?.closeConfirmationModal
                    ? setModalOpeningCondition
                    : undefined
                )}
              </AnimatePresence>
            </AnimatedLayout>
          </div>
        </FocusTrap>

        {windowProps?.closeConfirmationModal && (
          <ReactModal
            isOpen={isModalOpen}
            {...windowProps.closeConfirmationModal.modalProps}
            portalClassName="modal-portal"
            onRequestClose={() => void setIsModalOpen(false)}
          >
            <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
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
