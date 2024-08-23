import React, { RefObject, useRef, useState } from "react";
import WindowWrapper from "./WindowWrapper";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import { useIsPresent } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AnimatedLayoutVariants } from "./AnimatedLayout";
import ReactModal from "react-modal";

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
        navigate("..");
      else setIsModalOpen(true);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalCondition = useRef<(() => boolean) | undefined>(undefined);
    const setModalOpeningCondition = (condition: () => boolean): void =>
      void (modalCondition.current = condition);

    useOutsideClick(wrapperRef, handleClose, "left");

    return (
      <>
        <WindowWrapper animationTriggers={windowProps?.animationTriggers}>
          {component(
            props,
            wrapperRef,
            handleClose,
            windowProps?.closeConfirmationModal
              ? setModalOpeningCondition
              : undefined
          )}
        </WindowWrapper>

        {windowProps?.closeConfirmationModal && (
          <ReactModal
            isOpen={isModalOpen}
            {...windowProps.closeConfirmationModal.modalProps}
            portalClassName="modal-portal"
            onRequestClose={() => void setIsModalOpen(false)}
          >
            {windowProps.closeConfirmationModal.children(
              () => void setIsModalOpen(false),
              () => {
                setIsModalOpen(false);
                handleClose(true);
              }
            )}
          </ReactModal>
        )}
      </>
    );
  };

export default WindowFC;
