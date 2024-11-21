import "./WorkoutCreator.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { WorkoutItemData } from "../WorkoutSetCreator/WorkoutItem/WorkoutItem";
import Icon from "../Icon/Icon";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import WindowFC from "../WindowWrapper/WindowFC";
import WorkoutSetCreator from "../WorkoutSetCreator/WorkoutSetCreator";
import CurrentEditingWorkoutSetsContext from "../../Contexts/CurrentEditingWorkoutSetsContext";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

const WorkoutCreator = WindowFC(
  ({}, { close: onClose, setModalConfirmationOpeningCondition }) => {
    const basicInfo = useContext(basicProfileInfoContext);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [currentSets, setCurrentSets] = useState<WorkoutItemData[]>([]);

    const titleInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      setModalConfirmationOpeningCondition?.(
        () => validateTitle() || validateSets()
      );
    }, [currentSets]);

    const validateTitle = (): boolean => {
      if (!titleInputRef.current?.value) {
        titleInputRef.current?.classList.add("invalid");
        return false;
      }

      titleInputRef.current?.classList.remove("invalid");
      return true;
    };

    const validateSets = (): boolean => {
      if (currentSets.length <= 0) {
        wrapperRef.current?.classList.add("invalid-exercise-selection");
        return false;
      }

      wrapperRef.current?.classList.remove("invalid-exercise-selection");
      return true;
    };

    async function handleSaveClick() {
      let isValid = validateTitle();
      isValid = validateSets() && isValid;

      if (
        !basicInfo ||
        !descriptionTextAreaRef.current ||
        !titleInputRef.current ||
        !isValid
      )
        return;

      const newWorkout: Schema<"CreateWorkoutRequestDTO"> = {
        name: titleInputRef.current.value,
        description: descriptionTextAreaRef.current.value,
        sets: currentSets
          .flatMap((workoutItem) =>
            workoutItem.sets.map((set) => ({
              exerciseId: workoutItem.exercise.id,
              set: set,
            }))
          )
          .map((x) => {
            let repRange = x.set.repRange
              .trim()
              .split("-")
              .map((x) => parseInt(x));

            if (repRange.length === 1)
              repRange = x.set.repRange
                .trim()
                .split(" ")
                .map((x) => parseInt(x));

            if (repRange.length === 1) repRange = [repRange[0], repRange[0]];

            const enumValue = ["1", "w", "d", "f"].indexOf(x.set.type ?? "1");

            const rir =
              !x.set.type || x.set.type === "1"
                ? x.set.rir
                : x.set.type === "w"
                ? -1
                : 0;

            return {
              exerciseId: x.exerciseId,
              bottomRepRange: repRange[0],
              topRepRange: repRange[1],
              riR: rir,
              type: enumValue as Schema<"SetType">,
            };
          }),
      };

      descriptionTextAreaRef.current.value = "";
      descriptionTextAreaRef.current.blur();
      sendAPIRequest("/api/workout", {
        method: "post",
        payload: newWorkout,
      }).then((newWorkout) => {
        if (newWorkout.code !== "Created") return;

        sessionStorage.setItem("revalidate-profile", "true");
        onClose(true);
      });
    }

    return (
      <CurrentEditingWorkoutSetsContext.Provider
        value={{
          currentSets,
          setCurrentSets,
        }}
      >
        <div ref={wrapperRef} className="workout-creator-container">
          <div className="header">
            <input
              ref={titleInputRef}
              type="text"
              className="title"
              placeholder="Workout title"
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

          <WorkoutSetCreator
            onOverlayOpen={() => {
              if (!wrapperRef.current) return;

              wrapperRef.current.style.overflow = "hidden";
              wrapperRef.current.scrollTop = 0;
            }}
            onOverlayClose={() => {
              if (!wrapperRef.current) return;

              wrapperRef.current.style.overflow = "auto";
              wrapperRef.current.scrollTop = 0;
            }}
          />

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
              Workout description
            </label>
          </div>
        </div>
      </CurrentEditingWorkoutSetsContext.Provider>
    );
  },
  {
    closeConfirmationModal: {
      children: (cancel, confirm) => {
        return (
          <div className="workout-creator-closing-modal-content-container">
            <h2 id="workout-creator-closing-modal-title">
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
          base: "workout-creator-closing-modal",
          beforeClose: "closing",
        },
        overlayClassName: "workout-creator-closing-modal-overlay",
        closeTimeoutMS: 250,
        shouldCloseOnOverlayClick: true,
        shouldFocusAfterRender: true,
        shouldReturnFocusAfterClose: true,
        aria: {
          describedby: "#workout-creator-closing-modal-title",
        },
      },
    },
  }
);

export default WorkoutCreator;
