import "./CreateRoutine.scss";
import { useRef, useState } from "react";
import { RoutineItemData } from "./RoutineItem/RoutineItem";
import Icon from "../../Icon/Icon";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import {
  getProfileCache,
  setProfileCache,
} from "../../../Pages/Profile/ProfileCache";
import WindowFC from "../../WindowWrapper/WindowFC";
import createRoutineLoader from "./CreateRoutineLoader";
import useLoaderData from "../../../BetterRouter/UseLoaderData";
import Async from "../../Async/Async";
import RoutineSetCreator from "./RoutineSetCreator";

type CreateRoutineWindowProps = {
  animationLength?: number;
  safeGuard?: number;
};

const CreateRoutineWindow = WindowFC<CreateRoutineWindowProps>(
  ({ animationLength, safeGuard }, wrapperRef, onClose) => {
    const loaderData = useLoaderData<typeof createRoutineLoader>();

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

    const handleSaveClick = (user: Schema<"SimpleUserResponseDTO"> | null) => {
      let isValid = isRoutineTitleValid();
      isValid = isSetSelectionValid() && isValid;

      if (!user || !textareaRef.current || !routineTitleRef.current || !isValid)
        return;

      const newWorkout: Schema<"CreateWorkoutRequestDTO"> = {
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
      sendAPIRequest("/api/workout", {
        method: "post",
        payload: newWorkout,
      }).then((newWorkout) => {
        if (newWorkout.code !== "Created") return;

        const profileCache = getProfileCache();
        setProfileCache({
          streak: profileCache!.streak,
          user: profileCache!.user,
          workouts: profileCache!.workouts.then((x) => {
            if (x?.code !== "OK") return x;

            x.content = [
              ...x.content,
              {
                id: newWorkout.content.id,
                name: newWorkout.content.name,
                isPublic: newWorkout.content.isPublic,
                creator: {
                  id: user.id,
                  name: user.name,
                  image: user.image,
                },
              },
            ];

            return x;
          }),
        });

        onClose();
      });
    };
    const [createdSets, setCreatedSets] = useState<RoutineItemData[] | null>(
      []
    );

    return (
      <div ref={wrapperRef} className="create-routine-window">
        <div className="create-routine-header">
          <input
            ref={routineTitleRef}
            type="text"
            id="routine-title"
            placeholder="Routine title"
            maxLength={25}
          />
          <div className="create-routine-public-or-private">
            <div
              ref={publicOrPrivatePopupRef}
              className="create-routine-public-or-private-popup"
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
                  className="create-routine-save"
                >
                  Save
                </button>
              );
            }}
          </Async>
        </div>

        <RoutineSetCreator
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

        <div className="create-routine-description">
          <textarea
            id="routine-description"
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
  }
);

export default CreateRoutineWindow;
