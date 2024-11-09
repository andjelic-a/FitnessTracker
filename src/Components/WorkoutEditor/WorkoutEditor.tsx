import "./WorkoutEditor.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import WindowFC from "../WindowWrapper/WindowFC";
import workoutDisplayLoader from "../WorkoutDisplay/WorkoutDisplayLoader";
import { useEffect, useRef, useState } from "react";
import { WorkoutItemData } from "../WorkoutSetCreator/WorkoutItem/WorkoutItem";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import WorkoutSetCreator from "../WorkoutSetCreator/WorkoutSetCreator";
import CurrentEditingWorkoutSetsContext from "../../Contexts/CurrentEditingWorkoutSetsContext";
import extractSets from "../../Utility/ExtractSetsFromWorkout";

const WorkoutEditor = WindowFC(
  ({}, onClose, setModalConfirmationOpeningCondition) => {
    const loaderData = useLoaderData<typeof workoutDisplayLoader>();
    const [currentSets, setCurrentSets] = useState<WorkoutItemData[]>([]);

    const titleInputRef = useRef<HTMLInputElement | null>(null);
    const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);
    const originalWorkout = useRef<Schema<"DetailedWorkoutResponseDTO"> | null>(
      null
    );
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setModalConfirmationOpeningCondition?.(
        () =>
          (validateTitle() || validateSets()) &&
          checkForChanges(assembleWorkout())
      );
    }, [currentSets]);

    useEffect(() => {
      loaderData?.workout.then((x) => {
        if (x.code !== "OK") {
          onClose(true);
          return;
        }

        originalWorkout.current = x.content;
        setCurrentSets(extractSets(x.content));
        titleInputRef.current!.value = x.content.name;
        descriptionTextAreaRef.current!.value = x.content.description;
      });
    }, [loaderData]);

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

    const checkForChanges = (
      updatedWorkout: Schema<"UpdateFullWorkoutRequestDTO">
    ): boolean => {
      const original = originalWorkout.current;
      if (!original) return true;

      if (updatedWorkout.name.trim() !== original.name.trim()) return true;
      if (updatedWorkout.description?.trim() !== original.description.trim())
        return true;
      if (updatedWorkout.sets.length !== original.sets.length) return true;

      for (let i = 0; i < updatedWorkout.sets.length; i++) {
        const updatedSet = updatedWorkout.sets[i];
        const originalSet = original.sets[i];

        if (updatedSet.exerciseId !== originalSet.exerciseId) return true;
        if (updatedSet.riR !== originalSet.riR) return true;
        if (updatedSet.topRepRange !== originalSet.topRepRange) return true;
        if (updatedSet.bottomRepRange !== originalSet.bottomRepRange)
          return true;
        if (updatedSet.type !== originalSet.type) return true;
      }

      return false;
    };

    function assembleWorkout(): Schema<"UpdateFullWorkoutRequestDTO"> {
      const updatedWorkout: Schema<"UpdateFullWorkoutRequestDTO"> = {
        name: titleInputRef.current?.value ?? "",
        description: descriptionTextAreaRef.current?.value ?? "",
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

      return updatedWorkout;
    }

    const handleSaveClick = async () => {
      let isValid = validateTitle();
      isValid = validateSets() && isValid;

      if (!descriptionTextAreaRef.current || !titleInputRef.current || !isValid)
        return;

      const originalWorkout = await loaderData.workout;
      if (originalWorkout.code !== "OK") return;

      const updatedWorkout = assembleWorkout();

      if (!checkForChanges(updatedWorkout)) {
        onClose(true);
        return;
      }

      descriptionTextAreaRef.current.value = "";
      descriptionTextAreaRef.current.blur();
      sendAPIRequest("/api/workout/{creator}/{name}", {
        method: "put",
        payload: updatedWorkout,
        parameters: {
          name: originalWorkout.content.name,
          creator: originalWorkout.content.creator.username,
        },
      });

      //TODO: Update cache
      onClose(true);
    };

    return (
      <CurrentEditingWorkoutSetsContext.Provider
        value={{
          currentSets,
          setCurrentSets,
        }}
      >
        <div ref={wrapperRef} className="workout-editor-container">
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
          <div className="workout-editor-closing-modal-content-container">
            <h2 id="workout-editor-closing-modal-title">
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
          base: "workout-editor-closing-modal",
          beforeClose: "closing",
        },
        overlayClassName: "workout-editor-closing-modal-overlay",
        closeTimeoutMS: 250,
        shouldCloseOnOverlayClick: true,
        shouldFocusAfterRender: true,
        shouldReturnFocusAfterClose: true,
        aria: {
          describedby: "workout-editor-closing-modal-title",
        },
      },
    },
  }
);

export default WorkoutEditor;
