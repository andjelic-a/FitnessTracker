import "./EditRoutine.scss";
import useLoaderData from "../../../BetterRouter/UseLoaderData";
import Async from "../../Async/Async";
import WindowFC from "../../WindowWrapper/WindowFC";
import routineDisplayLoader from "../../RoutineDisplay/RoutineDisplayLoader";
import RoutineSetCreator from "../CreateRoutine/RoutineSetCreator";
import { useEffect, useRef, useState } from "react";
import { RoutineItemData } from "../CreateRoutine/RoutineItem/RoutineItem";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import Icon from "../../Icon/Icon";
import extractSets from "./ExtractSetsFromWorkout";
import {
  getProfileCache,
  setProfileCache,
} from "../../../Pages/Profile/ProfileCache";

type EditRoutineWindowProps = {
  animationLength?: number;
  safeGuard?: number;
};

const EditRoutine = WindowFC<EditRoutineWindowProps>(
  ({ animationLength, safeGuard }, wrapperRef, onClose) => {
    const loaderData = useLoaderData<typeof routineDisplayLoader>();

    const [isPublic, setIsPublic] = useState<boolean>(false);

    const createdSetsRef = useRef<RoutineItemData[]>([]);
    const routineTitleRef = useRef<HTMLInputElement | null>(null);
    const publicOrPrivatePopupRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isRoutineTitleValid = (): boolean => {
      if (!routineTitleRef.current?.value) {
        routineTitleRef.current?.classList.add("routine-item-error-title");
        return false;
      }

      routineTitleRef.current?.classList.remove("routine-item-error-title");
      return true;
    };

    const isSetSelectionValid = (): boolean => {
      if (createdSetsRef.current.length <= 0) {
        wrapperRef.current?.classList.add("routine-item-error-button");
        return false;
      }

      wrapperRef.current?.classList.remove("routine-item-error-button");
      return true;
    };

    const handleSaveClick = () => {
      loaderData?.routine.then((originalWorkout) => {
        let isValid = isRoutineTitleValid();
        isValid = isSetSelectionValid() && isValid;

        if (originalWorkout.code !== "OK") return;
        if (!textareaRef.current || !routineTitleRef.current || !isValid)
          return;

        const updatedWorkout: Schema<"UpdateFullWorkoutRequestDTO"> = {
          isPublic: isPublic,
          name: routineTitleRef.current.value,
          description: textareaRef.current.value,
          sets: createdSetsRef.current
            .flatMap((routineItem) =>
              routineItem.sets.map((set) => ({
                exerciseId: routineItem.exercise.id,
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

        const profileCache = getProfileCache();
        setProfileCache({
          streak: profileCache!.streak,
          user: profileCache!.user,
          workouts: profileCache!.workouts.then((x) => {
            if (x?.code !== "OK") return x;

            const index = x.content.findIndex(
              (x) => x.id === originalWorkout.content.id
            );

            x.content[index] = {
              id: originalWorkout.content.id,
              name: updatedWorkout.name,
              isPublic: updatedWorkout.isPublic,
              creator: originalWorkout.content.creator,
            };

            return x;
          }),
        });

        onClose();
      });
    };
    const [createdSets, setCreatedSets] = useState<RoutineItemData[] | null>(
      null
    );

    useEffect(() => {
      loaderData?.routine.then((x) => {
        setCreatedSets(x.code === "OK" ? extractSets(x.content) : []);
        setIsPublic(x.code === "OK" ? x.content.isPublic : false);
      });
    }, [loaderData]);

    return (
      <Async await={loaderData?.routine}>
        {(originalWorkout) => {
          if (originalWorkout?.code !== "OK") return null;

          if (createdSets === null) return null;

          return (
            <div ref={wrapperRef} className="edit-routine-window">
              <div className="edit-routine-header">
                <input
                  defaultValue={originalWorkout.content.name}
                  ref={routineTitleRef}
                  type="text"
                  id="routine-title"
                  placeholder="Routine title"
                  maxLength={25}
                />
                <div className="edit-routine-public-or-private">
                  <div
                    ref={publicOrPrivatePopupRef}
                    className="edit-routine-public-or-private-popup"
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

                <button onClick={handleSaveClick} className="edit-routine-save">
                  Save
                </button>
              </div>

              <RoutineSetCreator
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
                animationLength={animationLength}
                safeGuard={safeGuard}
              />

              <div className="edit-routine-description">
                <textarea
                  id="routine-description"
                  defaultValue={
                    originalWorkout.content.description ?? undefined
                  }
                  ref={textareaRef}
                  onChange={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
                <label
                  htmlFor="routine-description"
                  className="routine-description-placeholder"
                >
                  Routine description
                </label>
              </div>
            </div>
          );
        }}
      </Async>
    );
  }
);

export default EditRoutine;
