import "./Pins.scss";
import Pin from "./Pin";
import { memo, useEffect, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Async from "../Async/Async";
import sendAPIRequest from "../../Data/SendAPIRequest";
import ReactModal from "react-modal";
import Icon from "../Icon/Icon";
import {
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import PinDragOverlay from "./PinDragOverlay";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

type PinsProps = {
  pins: Schema<"PinResponseDTO">[];
};

const Pins = memo<PinsProps>(({ pins }) => {
  const [pinOptionsPromise, setPinOptionsPromise] = useState<Promise<
    Schema<"PinResponseDTO">[]
  > | null>(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  const [selectedPins, setSelectedPins] = useState<Schema<"PinResponseDTO">[]>(
    []
  );
  const isWaitingForResponse = useRef(false);

  useEffect(() => void setSelectedPins(pins), [pins]);

  const [draggingPin, setDraggingPin] =
    useState<Schema<"PinResponseDTO"> | null>(null);

  const [isWaitingForReorder, setIsWaitingForReorder] = useState(false);

  const pinsBodyRef = useRef<HTMLDivElement>(null);

  function handleSelectionSave() {
    if (isWaitingForResponse.current) return;
    isWaitingForResponse.current = true;

    const deletedPins = pins.filter(
      (x) => selectedPins.findIndex((y) => y.id === x.id) < 0
    );

    const createdPins = selectedPins.filter(
      (x) => pins.findIndex((y) => y.id === x.id) < 0
    );

    const deleteWorkoutPins = () =>
      deletedPins.length === 0
        ? Promise.resolve()
        : sendAPIRequest(`/api/user/pins`, {
            method: "delete",
            payload: {
              deletedPins,
            },
          });

    const createWorkoutPins = () =>
      createdPins.length === 0
        ? Promise.resolve()
        : sendAPIRequest(`/api/user/pins`, {
            method: "post",
            payload: {
              newPins: createdPins,
            },
          });

    const closeMenu = () => {
      isWaitingForResponse.current = false;
      handleCloseMenu();
    };

    deleteWorkoutPins().then(() => void createWorkoutPins().then(closeMenu));
  }

  function preventPinsBodyHeightUpdates() {
    if (pinsBodyRef.current) {
      const bodyRect = pinsBodyRef.current.getBoundingClientRect();
      pinsBodyRef.current.style.minHeight = `${bodyRect.height}px`;
    }
  }

  function resetPinsBodyHeight() {
    if (pinsBodyRef.current) pinsBodyRef.current.style.minHeight = "";
  }

  function handleOpenMenu() {
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
    preventPinsBodyHeightUpdates();

    if (!pinOptionsPromise)
      setPinOptionsPromise(
        sendAPIRequest("/api/user/me/pins/options", {
          method: "get",
        }).then((x) => (x.code === "OK" ? x.content : []))
      );
  }

  function handleCloseMenu() {
    resetPinsBodyHeight();
    setIsOptionsMenuOpen(false);
  }

  return (
    <DndContext
      onDragStart={({
        active: {
          data: { current: data },
        },
      }) => {
        if (data?.type !== "Pin") return;
        preventPinsBodyHeightUpdates();
        setDraggingPin(data.pin);
      }}
      onDragCancel={() => {
        setDraggingPin(null);
        resetPinsBodyHeight();
      }}
      onDragEnd={({ active, over }) => {
        setTimeout(() => void setDraggingPin(null), 150);

        if (isWaitingForReorder || !over) return;

        const activeId = active.data.current?.pin.id;
        const overId = over.data.current?.pin.id;

        if (!activeId || !overId || activeId === overId) return;

        const activeIndex = selectedPins.findIndex((x) => x.id === activeId);
        const overIndex = selectedPins.findIndex((x) => x.id === overId);
        const newOrder = arrayMove(selectedPins, activeIndex, overIndex);

        resetPinsBodyHeight();
        setSelectedPins(newOrder);
        setIsWaitingForReorder(true);

        sendAPIRequest("/api/user/me/pins/reorder", {
          method: "patch",
          payload: {
            newOrder: newOrder.map((x, i) => ({
              id: x.id,
              type: x.type,
              newOrder: i + 1,
            })),
          },
        }).then(() => void setIsWaitingForReorder(false));
      }}
    >
      <div className="pins-container">
        <div className="pins-header">
          <h1>Pinned</h1>
          <button onClick={handleOpenMenu}>Customize your pins</button>
        </div>

        <div className="pins-body" ref={pinsBodyRef}>
          <SortableContext items={selectedPins.map((x) => x.id)}>
            {selectedPins.map((x) => (
              <Pin
                key={x.id}
                pin={x}
                collapsedDescription={draggingPin !== null}
              />
            ))}
          </SortableContext>
        </div>

        <ReactModal
          isOpen={isOptionsMenuOpen}
          onRequestClose={handleCloseMenu}
          className={{
            afterOpen: "open",
            base: "pins-options-menu-container",
            beforeClose: "closing",
          }}
          overlayClassName="overlay-modal"
          portalClassName="modal-portal"
          closeTimeoutMS={200}
        >
          <div className="pins-options-menu-header">
            <h1>Edit pinned items</h1>

            <button className="close-btn">
              <Icon name="xmark" onClick={handleCloseMenu} />
            </button>
          </div>

          <div className="pins-options-menu-body">
            <div className="info-section">
              <p>
                Select up to six public workouts or splits you'd like to show to
                anyone.
              </p>

              <p
                className="limit"
                style={{
                  color: selectedPins.length >= 6 ? "red" : "inherit",
                }}
              >
                {6 - selectedPins.length} remaining
              </p>
            </div>

            <Async await={pinOptionsPromise ?? Promise.resolve([])}>
              {(options) =>
                options.map((x) => (
                  <div
                    className="option"
                    key={x.name + "-" + x.type}
                    onClick={() => {
                      if (selectedPins.findIndex((y) => x.id === y.id) < 0) {
                        if (selectedPins.length < 6) {
                          setSelectedPins([...selectedPins, x]);
                        }
                      } else
                        setSelectedPins(
                          selectedPins.filter((y) => x.id !== y.id)
                        );
                    }}
                  >
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        name={`${x.name}-${x.type}`}
                        id={`${x.name}-${x.type}`}
                        checked={
                          selectedPins.findIndex((y) => x.id === y.id) >= 0
                        }
                        readOnly
                      />

                      <Icon
                        name={x.type === 0 ? "dumbbell" : "calendar-week"}
                      />

                      <label htmlFor={`${x.name}-${x.type}`}>{x.name}</label>
                    </div>

                    <div className="like-count-container">
                      <p>{x.likeCount}</p>
                      <Icon name="thumbs-up" />
                    </div>
                  </div>
                ))
              }
            </Async>
          </div>

          <button className="save-button" onClick={handleSelectionSave}>
            Save
          </button>
        </ReactModal>
      </div>

      {createPortal(
        <DragOverlay
          className="drag-overlay"
          modifiers={[snapCenterToCursor]}
          dropAnimation={{
            ...defaultDropAnimation,
            duration: 150,
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: "0.5",
                },
              },
            }),
          }}
        >
          {draggingPin && <PinDragOverlay pin={draggingPin} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
});

export default Pins;
