import "./EditWorkout.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import Async from "../Async/Async";
import WindowFC from "../WindowWrapper/WindowFC";
import workoutDisplayLoader from "../WorkoutDisplay/WorkoutDisplayLoader";
import { useEffect, useRef, useState } from "react";
import { WorkoutItemData } from "../CreateWorkout/WorkoutItem/WorkoutItem";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import extractSets from "./ExtractSetsFromWorkout";
import WorkoutSetCreator from "../WorkoutSetCreator/WorkoutSetCreator";

const EditWorkout = WindowFC(({}, wrapperRef, onClose) => {
  const loaderData = useLoaderData<typeof workoutDisplayLoader>();

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
      wrapperRef.current?.classList.add("invalid-exercise-selection");
      return false;
    }

    wrapperRef.current?.classList.remove("invalid-exercise-selection");
    return true;
  };

  const handleSaveClick = () => {
    loaderData?.workout.then((originalWorkout) => {
      let isValid = isWorkoutTitleValid();
      isValid = isSetSelectionValid() && isValid;

      if (originalWorkout.code !== "OK") return;
      if (!textareaRef.current || !workoutTitleRef.current || !isValid) return;

      const updatedWorkout: Schema<"UpdateFullWorkoutRequestDTO"> = {
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
      sendAPIRequest("/api/workout/{id}", {
        method: "put",
        payload: updatedWorkout,
        parameters: {
          id: originalWorkout.content.id,
        },
      });

      //TODO: Update cache
      /*         const profileCache = getProfileCache();
        setProfileCache({
          streak: profileCache!.streak,
          user: profileCache!.user,
          latestWeekOfActivity: profileCache!.latestWeekOfActivity,
          workouts: profileCache!.workouts.then((x) => {
            const index = x.findIndex(
              (x) => x.id === originalWorkout.content.id
            );

            x[index] = {
              id: originalWorkout.content.id,
              name: updatedWorkout.name,
              isPublic: updatedWorkout.isPublic,
              creator: originalWorkout.content.creator,
              description: textareaRef.current!.value,
            };

            return x;
          }),
        }); */

      onClose();
    });
  };
  const [createdSets, setCreatedSets] = useState<WorkoutItemData[] | null>(
    null
  );

  useEffect(() => {
    loaderData?.workout.then((x) => {
      setCreatedSets(x.code === "OK" ? extractSets(x.content) : []);
      setIsPublic(x.code === "OK" ? x.content.isPublic : false);
    });
  }, [loaderData]);

  return (
    <Async await={loaderData?.workout}>
      {(originalWorkout) => {
        if (originalWorkout?.code !== "OK") return null;

        if (createdSets === null) return null;

        return (
          <div ref={wrapperRef} className="edit-workout-window">
            <div className="edit-workout-header">
              <input
                defaultValue={originalWorkout.content.name}
                ref={workoutTitleRef}
                type="text"
                id="workout-title"
                placeholder="Workout title"
                maxLength={25}
              />
              <div className="edit-workout-public-or-private">
                <div
                  ref={publicOrPrivatePopupRef}
                  className="edit-workout-public-or-private-popup"
                >
                  {isPublic ? "Public" : "Private"}
                </div>

                <Icon
                  className="lock"
                  name={isPublic ? "unlock" : "lock"}
                  onClick={() => setIsPublic((x) => !x)}
                  onMouseEnter={() =>
                    publicOrPrivatePopupRef.current?.classList.add("show")
                  }
                  onMouseLeave={() =>
                    publicOrPrivatePopupRef.current?.classList.remove("show")
                  }
                />
              </div>

              <button onClick={handleSaveClick} className="edit-workout-save">
                Save
              </button>
            </div>

            <WorkoutSetCreator
              setCreatedSets={setCreatedSets}
              createdSets={createdSets}
              onSetsChange={(newSets) =>
                void (createdSetsRef.current = newSets)
              }
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
            />

            <div className="edit-description-input">
              <textarea
                id="description-input"
                defaultValue={originalWorkout.content.description ?? undefined}
                ref={textareaRef}
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
      }}
    </Async>
  );
});

export default EditWorkout;
