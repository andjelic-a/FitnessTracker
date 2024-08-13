import "./CreateWorkout.scss";
import { useContext, useRef, useState } from "react";
import { WorkoutItemData } from "./WorkoutItem/WorkoutItem";
import Icon from "../../Icon/Icon";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import WindowFC from "../../WindowWrapper/WindowFC";
import createWorkoutLoader from "./CreateWorkoutLoader";
import useLoaderData from "../../../BetterRouter/UseLoaderData";
import Async from "../../Async/Async";
import WorkoutSetCreator from "./WorkoutSetCreator";
import { NewWorkoutsContext } from "./NewWorkoutsContext";

type CreateWorkoutWindowProps = {
  animationLength?: number;
  safeGuard?: number;
};

const CreateWorkoutWindow = WindowFC<CreateWorkoutWindowProps>(
  ({ animationLength, safeGuard }, wrapperRef, onClose) => {
    const loaderData = useLoaderData<typeof createWorkoutLoader>();
    const newWorkoutsContext = useContext(NewWorkoutsContext);

    const [isPublic, setIsPublic] = useState<boolean>(false);

    const createdSetsRef = useRef<WorkoutItemData[]>([]);
    const workoutTitleRef = useRef<HTMLInputElement | null>(null);
    const publicOrPrivatePopupRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isWorkoutTitleValid = (): boolean => {
      if (!workoutTitleRef.current?.value) {
        workoutTitleRef.current?.classList.add("workout-item-error-title");
        return false;
      }

      workoutTitleRef.current?.classList.remove("workout-item-error-title");
      return true;
    };

    const isSetSelectionValid = (): boolean => {
      if (createdSetsRef.current.length <= 0) {
        wrapperRef.current?.classList.add("workout-item-error-button");
        return false;
      }

      wrapperRef.current?.classList.remove("workout-item-error-button");
      return true;
    };

    const handleSaveClick = (user: Schema<"SimpleUserResponseDTO"> | null) => {
      let isValid = isWorkoutTitleValid();
      isValid = isSetSelectionValid() && isValid;

      if (!user || !textareaRef.current || !workoutTitleRef.current || !isValid)
        return;

      const newWorkout: Schema<"CreateWorkoutRequestDTO"> = {
        isPublic: isPublic,
        name: workoutTitleRef.current.value,
        description: textareaRef.current.value,
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

      textareaRef.current.value = "";
      textareaRef.current.blur();
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

    return (
      <div ref={wrapperRef} className="create-workout-window">
        <div className="create-workout-header">
          <input
            ref={workoutTitleRef}
            type="text"
            id="workout-title"
            placeholder="Workout title"
            maxLength={25}
          />
          <div className="create-workout-public-or-private">
            <div
              ref={publicOrPrivatePopupRef}
              className="create-workout-public-or-private-popup"
            >
              {isPublic ? "Public" : "Private"}
            </div>
            {isPublic ? (
              <Icon
                className="lock"
                name="unlock"
                onClick={() => setIsPublic(false)}
                onMouseEnter={() =>
                  publicOrPrivatePopupRef.current?.classList.add("show")
                }
                onMouseLeave={() =>
                  publicOrPrivatePopupRef.current?.classList.remove("show")
                }
              />
            ) : (
              <Icon
                className="lock"
                name="lock"
                onClick={() => setIsPublic(true)}
                onMouseEnter={() =>
                  publicOrPrivatePopupRef.current?.classList.add("show")
                }
                onMouseLeave={() =>
                  publicOrPrivatePopupRef.current?.classList.remove("show")
                }
              />
            )}
          </div>

          <Async await={loaderData?.user ?? null}>
            {(user) => {
              if (!user) return null;

              return (
                <button
                  onClick={() => handleSaveClick(user)}
                  className="create-workout-save"
                >
                  Save
                </button>
              );
            }}
          </Async>
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

        <div className="create-workout-description">
          <textarea
            id="workout-description"
            ref={textareaRef}
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          <label
            htmlFor="workout-description"
            className="workout-description-placeholder"
          >
            Workout description
          </label>
        </div>
      </div>
    );
  }
);

export default CreateWorkoutWindow;
