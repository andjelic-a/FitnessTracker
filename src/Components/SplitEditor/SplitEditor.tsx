import { useContext, useEffect, useMemo, useRef, useState } from "react";
import WindowFC from "../WindowWrapper/WindowFC";
import "./SplitEditor.scss";
import Icon from "../Icon/Icon";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import SplitWorkoutSelector from "../SplitWorkoutSelector/SplitWorkoutSelector";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { Day } from "../../Types/Utility/Day";
import splitDisplayLoader from "../SplitDisplay/SplitDisplayLoader";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

const SplitEditor = WindowFC(
  ({}, onClose, setModalConfirmationOpeningCondition) => {
    const loaderData = useLoaderData<typeof splitDisplayLoader>();
    const basicInfo = useContext(basicProfileInfoContext);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [selectedWorkouts, setSelectedWorkouts] = useState<
      {
        day: Day;
        selected: Schema<"SimpleWorkoutResponseDTO"> | null;
      }[]
    >([
      {
        day: "Sunday",
        selected: null,
      },
      {
        day: "Monday",
        selected: null,
      },
      {
        day: "Tuesday",
        selected: null,
      },
      {
        day: "Wednesday",
        selected: null,
      },
      {
        day: "Thursday",
        selected: null,
      },
      {
        day: "Friday",
        selected: null,
      },
      {
        day: "Saturday",
        selected: null,
      },
    ]);

    const titleInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

    const originalSplit = useRef<Schema<"DetailedSplitResponseDTO"> | null>(
      null
    );

    useEffect(() => {
      loaderData?.split?.then((x) => {
        if (x.code !== "OK") return;

        originalSplit.current = x.content;

        const splitWorkouts = x.content.workouts;
        const workouts: (Schema<"SimpleSplitWorkoutResponseDTO"> | null)[] = [];
        for (let i = 0; i < 7; i++) {
          const workout = splitWorkouts.find((x) => x.day === i) ?? null;
          workouts.push(workout);
        }

        const days: Day[] = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        setSelectedWorkouts(
          workouts.map((x, i) => ({ day: days[i], selected: x }))
        );

        titleInputRef.current!.value = x.content.name;
        descriptionTextAreaRef.current!.value = x.content.description;
      });
    }, [loaderData]);

    function checkForBasicChanges() {
      return (
        originalSplit.current &&
        titleInputRef.current &&
        descriptionTextAreaRef.current &&
        (originalSplit.current.name.trim() !==
          titleInputRef.current.value.trim() ||
          originalSplit.current.description.trim() !==
            descriptionTextAreaRef.current.value.trim())
      );
    }

    function checkForWorkoutChanges() {
      return false;
    }

    async function handleSaveClick() {
      let isValid = validateTitle();
      isValid = validateWorkouts() && isValid;

      if (
        !basicInfo ||
        !descriptionTextAreaRef.current ||
        !titleInputRef.current ||
        !isValid
      )
        return;

      const newSplit: Schema<"CreateSplitRequestDTO"> = {
        description: descriptionTextAreaRef.current.value,
        name: titleInputRef.current.value,
        workouts: selectedWorkouts
          .filter((x) => x.selected !== null)
          .map((x) => ({
            day: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].indexOf(x.day) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
            workoutId: x.selected!.id,
          })),
      };

      sendAPIRequest("/api/split", {
        method: "post",
        payload: newSplit,
      }).then((x) => {
        if (x.code !== "Created") return;
        onClose(true);
      });
    }

    const [isWorkoutSelectorOpen, setIsWorkoutSelectorOpen] = useState(false);
    const workoutSelectorPortalNode = useMemo(() => createHtmlPortalNode(), []);

    const [selectingForDay, setSelectingForDay] = useState<Day | null>(null);

    useEffect(() => {
      setModalConfirmationOpeningCondition?.(
        () => checkForBasicChanges() || checkForWorkoutChanges()
      );
    }, [selectedWorkouts]);

    function validateWorkouts() {
      return selectedWorkouts.some((x) => x.selected !== null);
    }

    function validateTitle(): boolean {
      if (!titleInputRef.current?.value) {
        titleInputRef.current?.classList.add("invalid");
        return false;
      }

      titleInputRef.current?.classList.remove("invalid");
      return true;
    }

    function handleOpenWorkoutSelector(day: Day) {
      setSelectingForDay(day);
      setIsWorkoutSelectorOpen(true);

      if (!wrapperRef.current) return;

      wrapperRef.current.style.overflow = "hidden";
      wrapperRef.current.scrollTop = 0;
    }

    function handleCloseWorkoutSelector() {
      if (!wrapperRef.current) return;

      wrapperRef.current.style.overflow = "auto";
      wrapperRef.current.scrollTop = 0;
      setIsWorkoutSelectorOpen(false);
    }

    return (
      <>
        <InPortal node={workoutSelectorPortalNode}>
          <SplitWorkoutSelector
            onClose={handleCloseWorkoutSelector}
            onConfirmSelection={(x) =>
              setSelectedWorkouts((prev) => {
                prev[
                  prev.findIndex((x) => x.day === selectingForDay)
                ].selected = x;
                return prev;
              })
            }
          />
        </InPortal>

        {isWorkoutSelectorOpen && (
          <OutPortal node={workoutSelectorPortalNode} />
        )}

        <div className="split-creator-container" ref={wrapperRef}>
          <div className="header">
            <input
              ref={titleInputRef}
              type="text"
              name="split-title"
              autoComplete="off"
              className="title"
              placeholder="Split title"
              maxLength={25}
            />

            <div className="buttons">
              <button onClick={() => onClose()} className="discard-btn">
                <p>Discard</p>
              </button>

              <button onClick={handleSaveClick} className="save-btn">
                <p>Save</p>
                <Icon name="floppy-disk" />
              </button>
            </div>
          </div>

          <div className="body">
            {selectedWorkouts.map((x) => (
              <div className="day-container" key={x.day}>
                <p>{x.day}</p>

                <div className="workout">
                  {x.selected === null ? (
                    <p className="rest">Rest</p>
                  ) : (
                    <WorkoutPreview workout={x.selected} />
                  )}
                </div>

                <button onClick={() => handleOpenWorkoutSelector(x.day)}>
                  Replace
                </button>
              </div>
            ))}
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
      </>
    );
  },
  {
    closeConfirmationModal: {
      children: (cancel, confirm) => {
        return (
          <div className="split-creator-closing-modal-content-container">
            <h2 id="split-creator-closing-modal-title">
              Are you sure you want to discard your changes?
            </h2>

            <div className="modal-buttons-container">
              <button onClick={cancel}>Cancel</button>
              <button onClick={confirm}>Confirm</button>
            </div>
          </div>
        );
      },
      modalProps: {
        className: {
          afterOpen: "open",
          base: "split-creator-closing-modal",
          beforeClose: "closing",
        },
        overlayClassName: "split-creator-closing-modal-overlay",
        closeTimeoutMS: 250,
        shouldCloseOnOverlayClick: true,
        shouldFocusAfterRender: true,
        shouldReturnFocusAfterClose: true,
        aria: {
          describedby: "#split-creator-closing-modal-title",
        },
      },
    },
  }
);

export default SplitEditor;
