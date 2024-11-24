import "./Pins.scss";
import Pin from "./Pin";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
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
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

type PinsProps = {
  pins: Schema<"PinResponseDTO">[];
  includeEditButtons?: boolean;
};

const Pins = memo<PinsProps>(({ pins, includeEditButtons }) => {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [previouslyOpen, setPreviouslyOpen] = useState(false);

  const [selectedPins, setSelectedPins] = useState<Schema<"PinResponseDTO">[]>(
    []
  );

  const [selectedMenuPins, setSelectedMenuPins] = useState<
    Schema<"PinResponseDTO">[]
  >([]);

  const isWaitingForResponse = useRef(false);

  useEffect(() => {
    setSelectedPins(pins);
    setSelectedMenuPins(pins);
  }, [pins]);

  const [draggingPin, setDraggingPin] =
    useState<Schema<"PinResponseDTO"> | null>(null);

  const [isWaitingForReorder, setIsWaitingForReorder] = useState(false);

  const pinsBodyRef = useRef<HTMLDivElement>(null);

  function handleSelectionSave() {
    if (isWaitingForResponse.current) return;
    isWaitingForResponse.current = true;

    const deletedPins = selectedPins.filter(
      (x) => selectedMenuPins.findIndex((y) => y.id === x.id) < 0
    );

    const createdPins = selectedMenuPins.filter(
      (x) => selectedPins.findIndex((y) => y.id === x.id) < 0
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
      setSelectedPins(selectedMenuPins);
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

  function handleCloseMenu() {
    setIsOptionsMenuOpen(false);
    resetPinsBodyHeight();
  }

  function handleOptionClick(option: Schema<"PinResponseDTO">) {
    if (selectedMenuPins.findIndex((y) => option.id === y.id) < 0) {
      if (selectedMenuPins.length < 6) {
        setSelectedMenuPins([...selectedMenuPins, option]);
      }
    } else
      setSelectedMenuPins(selectedMenuPins.filter((y) => option.id !== y.id));
  }

  const segment = useCallback(
    (segmentData: APIResponse<"/api/user/pins/options", "get">) => {
      if (segmentData.code !== "OK") return null;

      return segmentData.content.map((x) => (
        <div
          className="option"
          key={x.name + "-" + x.type}
          onClick={(e) => {
            handleOptionClick(x);
            e.stopPropagation();
          }}
        >
          <div className="checkbox-container">
            <input
              type="checkbox"
              name={`${x.name}-${x.type}`}
              id={`${x.name}-${x.type}`}
              checked={selectedMenuPins.findIndex((y) => x.id === y.id) >= 0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleOptionClick(x);
                  e.stopPropagation();
                }
              }}
              readOnly
            />

            <label htmlFor={`${x.name}-${x.type}`}>
              <h3>{x.name}</h3>
              &nbsp;
              <p>{x.type === 0 ? "(Workout)" : "(Split)"}</p>
            </label>
          </div>

          <div className="like-count-container">
            <p>{x.likeCount}</p>
            <Icon name="thumbs-up" />
          </div>
        </div>
      ));
    },
    [selectedMenuPins]
  );

  const apiRequest = useMemo(
    () =>
      ({
        method: "get",
        parameters: {
          limit: 15,
          offset: 0,
        },
      } as const),
    []
  );

  const lazyLoadingContainerMemo = useMemo(
    () => (
      <LazyLoadingContainer
        endpoint="/api/user/pins/options"
        baseAPIRequest={apiRequest}
        onSegmentLoad={segment}
        stopCondition={(response) =>
          response.code === "OK" && response.content.length < 15
        }
      />
    ),
    [segment]
  );

  const portalNode = useMemo(() => createHtmlPortalNode(), []);

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
      onDragCancel={() => void setDraggingPin(null)}
      onDragEnd={({ active, over }) => {
        setTimeout(() => void setDraggingPin(null), 150);

        if (isWaitingForReorder || !over) return;

        const activeId = active.data.current?.pin.id;
        const overId = over.data.current?.pin.id;

        if (!activeId || !overId || activeId === overId) return;

        const activeIndex = selectedPins.findIndex((x) => x.id === activeId);
        const overIndex = selectedPins.findIndex((x) => x.id === overId);
        const newOrder = arrayMove(selectedPins, activeIndex, overIndex);

        setSelectedPins(newOrder);
        setIsWaitingForReorder(true);

        sendAPIRequest("/api/user/pins/reorder", {
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
      <InPortal
        node={portalNode}
        children={
          includeEditButtons && previouslyOpen && lazyLoadingContainerMemo
        }
      />

      <div className="pins-container">
        <div className="pins-header">
          {selectedPins.length > 0 ? <h1>Pinned</h1> : <h1></h1>}
          {includeEditButtons && (
            <button
              draggable="false"
              className={`customize-button ${
                selectedPins.length > 0 ? "upper-right" : "lower-right"
              }`}
              onClick={() => {
                if (!previouslyOpen) setPreviouslyOpen(true);

                setIsOptionsMenuOpen(true);
              }}
            >
              Customize your pins
            </button>
          )}
        </div>

        {selectedPins.length > 0 && (
          <div className="pins-body" ref={pinsBodyRef}>
            <SortableContext items={selectedPins.map((x) => x.id)}>
              {selectedPins.map((x) => (
                <Pin
                  key={x.id}
                  pin={x}
                  includeDragHandle={includeEditButtons ?? false}
                />
              ))}
            </SortableContext>
          </div>
        )}

        <ReactModal
          isOpen={isOptionsMenuOpen}
          onRequestClose={handleSelectionSave}
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

            <button className="close-btn" onClick={handleSelectionSave}>
              <Icon name="xmark" />
            </button>
          </div>

          <div className="pins-options-menu-body">
            <div className="info-section">
              <p>
                Select up to six workouts or splits you'd like to show to
                anyone.
              </p>

              <p
                className="limit"
                style={{
                  color: selectedMenuPins.length >= 6 ? "red" : "inherit",
                }}
              >
                {6 - selectedMenuPins.length} remaining
              </p>
            </div>

            <OutPortal node={portalNode} />
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
