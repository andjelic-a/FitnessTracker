import { useContext, useEffect, useMemo, useRef, useState } from "react";
import WindowFC from "../WindowWrapper/WindowFC";
import "./SplitCreator.scss";
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
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";
import Description from "../Description/Description";

const SplitCreator = WindowFC(
  ({}, onClose, setModalConfirmationOpeningCondition) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const basicInfo = useContext(basicProfileInfoContext);
    const [selectedWorkouts, setselectedWorkouts] = useState<
      {
        day: Day;
        selected: Schema<"SimpleWorkoutOptionResponseDTO"> | null;
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
    const [hoveredDay, setHoveredDay] = useState<string | null>(null);

    const titleInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

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

        sessionStorage.setItem("revalidate-profile", "true");
        onClose(true);
      });
    }

    const [isWorkoutSelectorOpen, setIsWorkoutSelectorOpen] = useState(false);
    const workoutSelectorPortalNode = useMemo(() => createHtmlPortalNode(), []);

    const [selectingForDay, setSelectingForDay] = useState<Day | null>(null);

    useEffect(() => {
      setModalConfirmationOpeningCondition?.(
        () => validateTitle() || validateWorkouts() || validateDescription()
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

    function validateDescription(): boolean {
      if (!descriptionTextAreaRef.current?.value) {
        descriptionTextAreaRef.current?.classList.add("invalid");
        return false;
      }

      descriptionTextAreaRef.current?.classList.remove("invalid");
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
            defaultWorkout={
              selectedWorkouts.find((x) => x.day === selectingForDay)
                ?.selected ?? null
            }
            onClose={handleCloseWorkoutSelector}
            onConfirmSelection={(x) =>
              setselectedWorkouts((prev) => {
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
                <div className="day-container-wrapper">
                  <h3>{x.day}</h3>

                  <div className="workout">
                    {x.selected === null ? (
                      <>
                        <Icon className="rest-icon" name="mug-hot" />
                        <p className="rest">Rest</p>
                      </>
                    ) : (
                      <WorkoutPreview
                        className="split-workout-preview"
                        workout={x.selected}
                      />
                    )}
                  </div>

                  <button
                    className={`day-container-button ${
                      hoveredDay === x.day ? "" : "hide"
                    }`}
                    onClick={() => handleOpenWorkoutSelector(x.day)}
                    onMouseOver={() => setHoveredDay(x.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    Replace
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Description
            ref={descriptionTextAreaRef}
            placeholder="Split description"
            isInputEnabled={true}
          />
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

export default SplitCreator;
