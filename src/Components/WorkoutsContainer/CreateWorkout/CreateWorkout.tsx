import "./CreateWorkout.scss";
import { useContext, useRef, useState } from "react";
import { WorkoutItemData } from "./WorkoutItem/WorkoutItem";
import Icon from "../../Icon/Icon";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import WindowFC from "../../WindowWrapper/WindowFC";
import WorkoutSetCreator from "./WorkoutSetCreator";
import { NewWorkoutsContext } from "./NewWorkoutsContext";
import { getProfileCache } from "../../../Pages/Profile/ProfileCache";
import { Tooltip } from "react-tooltip";

type CreateWorkoutWindowProps = {
  animationLength?: number;
  safeGuard?: number;
};

const CreateWorkoutWindow = WindowFC<CreateWorkoutWindowProps>(
  ({ animationLength, safeGuard }, wrapperRef, onClose) => {
    const newWorkoutsContext = useContext(NewWorkoutsContext);

    const [isPublic, setIsPublic] = useState<boolean>(false);

    const createdSetsRef = useRef<WorkoutItemData[]>([]);
    const workoutTitleRef = useRef<HTMLInputElement | null>(null);
    const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(null);

    const validateTitle = (): boolean => {
      if (!workoutTitleRef.current?.value) {
        workoutTitleRef.current?.classList.add("workout-item-error-title");
        return false;
      }

      workoutTitleRef.current?.classList.remove("workout-item-error-title");
      return true;
    };

    const validateSets = (): boolean => {
      if (createdSetsRef.current.length <= 0) {
        wrapperRef.current?.classList.add("workout-item-error-button");
        return false;
      }

      wrapperRef.current?.classList.remove("workout-item-error-button");
      return true;
    };

    const handleSaveClick = async () => {
      const userResponse = await getProfileCache()?.user;
      const user = userResponse?.code !== "OK" ? null : userResponse?.content;

      let isValid = validateTitle();
      isValid = validateSets() && isValid;

      if (
        !user ||
        !descriptionTextAreaRef.current ||
        !workoutTitleRef.current ||
        !isValid
      )
        return;

      const newWorkout: Schema<"CreateWorkoutRequestDTO"> = {
        isPublic: isPublic,
        name: workoutTitleRef.current.value,
        description: descriptionTextAreaRef.current.value,
        sets: createdSetsRef.current
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

            const enumValue = ["1", "w", "d", "f"].indexOf(
              x.set.selectedIcon ?? "1"
            );

            const rir =
              !x.set.selectedIcon || x.set.selectedIcon === "1"
                ? x.set.rir
                : x.set.selectedIcon === "w"
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

        const simulatedResponse: Schema<"SimpleWorkoutResponseDTO"> = {
          id: newWorkout.content.id,
          name: newWorkout.content.name,
          isPublic: newWorkout.content.isPublic,
          creator: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
          description: "",
        };

        onClose();
        newWorkoutsContext.addWorkout(simulatedResponse);
      });
    };

    const [createdSets, setCreatedSets] = useState<WorkoutItemData[] | null>(
      []
    );

    console.log("Rerendering create workout window");

    return (
      <div ref={wrapperRef} className="create-workout-window">
        <div className="header">
          <input
            ref={workoutTitleRef}
            type="text"
            className="title"
            placeholder="Workout title"
            maxLength={25}
          />

          <div className="buttons">
            <button
              className="workout-visibility-toggle"
              onClick={() => setIsPublic(!isPublic)}
              data-tooltip-content={isPublic ? "Public" : "Private"}
              data-tooltip-id="workout-visibility-tooltip"
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

              <Tooltip id="workout-visibility-tooltip" />
            </button>

            <button onClick={handleSaveClick} className="create-btn">
              <p>Save</p>
              <Icon name="floppy-disk" />
            </button>
          </div>
        </div>

        <WorkoutSetCreator
          setCreatedSets={setCreatedSets}
          createdSets={createdSets ?? []}
          onSetsChange={(newSets) => void (createdSetsRef.current = newSets)}
          onStartChoosingExercise={() => {
            if (!wrapperRef.current) return;

            wrapperRef.current.style.overflow = "hidden";
            wrapperRef.current.scrollTop = 0;
          }}
          onConfirmExerciseSelection={() => {
            if (!wrapperRef.current) return;

            wrapperRef.current.style.overflow = "auto";
            wrapperRef.current.scrollTop = 0;
          }}
          animationLength={animationLength}
          safeGuard={safeGuard}
        />

        <div className="description-container">
          <textarea
            id="description-input"
            ref={descriptionTextAreaRef}
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          
          <label
            htmlFor="description-input"
            className="description-input-label"
          >
            Workout description
          </label>
        </div>
      </div>
    );
  }
);

export default CreateWorkoutWindow;
