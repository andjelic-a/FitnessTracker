import { useEffect, useMemo, useRef, useState } from "react";
import WindowFC from "../WindowWrapper/WindowFC";
import "./SplitCreator.scss";
import Icon from "../Icon/Icon";
import { Tooltip } from "react-tooltip";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import SplitWorkoutSelector from "../SplitWorkoutSelector/SplitWorkoutSelector";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import { getProfileCache } from "../../Pages/Profile/ProfileCache";
import sendAPIRequest from "../../Data/SendAPIRequest";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const SplitCreator = WindowFC(
  ({}, onClose, setModalConfirmationOpeningCondition) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [selectedWorkouts, setselectedWorkouts] = useState<
      {
        day: Day;
        selected: Schema<"SimpleWorkoutOptionResponseDTO"> | null;
      }[]
    >([
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
      {
        day: "Sunday",
        selected: null,
      },
    ]);
    const [isPublic, setIsPublic] = useState<boolean>(false);

    const titleInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

    async function handleSaveClick() {
      const userResponse = await getProfileCache()?.user;
      const user = userResponse?.code !== "OK" ? null : userResponse?.content;

      let isValid = validateTitle();
      isValid = validateWorkouts() && isValid;

      if (
        !user ||
        !descriptionTextAreaRef.current ||
        !titleInputRef.current ||
        !isValid
      )
        return;

      const newSplit: Schema<"CreateSplitRequestDTO"> = {
        description: descriptionTextAreaRef.current.value,
        isPublic: isPublic,
        name: titleInputRef.current.value,
        workouts: selectedWorkouts
          .filter((x) => x.selected !== null)
          .map((x) => ({
            day: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].indexOf(x.day) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
            workoutId: x.selected!.id,
          })),
      };

      sendAPIRequest("/api/split", {
        method: "post",
        payload: newSplit,
      }).then((x) => {
        if (x.code !== "Created") return;

        //TODO: Implement simulated response
        /* const simulatedResponse: Schema<"SimpleSplitResponseDTO"> = {
          creator: user,
          ...x.content,
        }; */

        onClose(true);
      });
    }

    const [isWorkoutSelectorOpen, setIsWorkoutSelectorOpen] = useState(false);
    const workoutSelectorPortalNode = useMemo(() => createHtmlPortalNode(), []);

    const [selectingForDay, setSelectingForDay] = useState<Day | null>(null);

    useEffect(() => {
      setModalConfirmationOpeningCondition?.(
        () => validateTitle() || validateWorkouts()
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

export default SplitCreator;
