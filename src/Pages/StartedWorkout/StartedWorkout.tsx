import "./StartedWorkout.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import startedWorkoutLoader from "./StartedWorkoutLoader";
import Async from "../../Components/Async/Async";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { extractSetsNoMapping } from "../../Utility/ExtractSetsFromWorkout";
import StartedWorkoutSet from "./StartedWorkoutSet";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { useNavigate } from "react-router-dom";
import ConfirmModalDialog from "../../Components/ConfirmModalDialog/ConfirmModalDialog";
import Icon from "../../Components/Icon/Icon";
import useOutsideClick from "../../Hooks/UseOutsideClick";

export type Unit = "kg" | "lbs";

export default function StartedWorkout() {
  const loaderData = useLoaderData<typeof startedWorkoutLoader>();
  const [completedSets, setCompletedSets] = useState<CompletedSet[]>([]);
  const navigate = useNavigate();
  const sentRequest = useRef(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    status: "invalid" | "not-complete" | "valid";
    completedPercent: number;
  }>({
    status: "invalid",
    completedPercent: -1,
  });
  const [activeExerciseDisplayPopup, setActiveExerciseDisplayPopup] =
    useState<boolean>(false);
  const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

  async function validateSets(): Promise<"invalid" | "not-complete" | "valid"> {
    if (completedSets.length === 0) return "invalid";

    const workoutResponse = await loaderData?.todaysWorkout;
    if (workoutResponse?.code !== "OK") return "invalid";

    const sets = workoutResponse.content.sets;
    const flatCompletedSets = completedSets.flatMap((x) => x.sets);

    let status: "not-complete" | "valid" =
      sets.length > flatCompletedSets.length ? "not-complete" : "valid";

    setValidationStatus({
      status: status,
      completedPercent: Math.round(
        (flatCompletedSets.length / sets.length) * 100
      ),
    });

    return status;
  }

  async function handleSaveBtnClick() {
    if (sentRequest.current) return;
    const validation = await validateSets();

    if (validation === "invalid") return;
    setIsConfirmationDialogOpen(true);
  }

  function save() {
    if (sentRequest.current) return;

    sentRequest.current = true;
    return sendAPIRequest("/api/user/split/today/complete-workout", {
      method: "post",
      payload: {
        completedSets: completedSets
          .flatMap((x) => x.sets)
          .map((x) => ({
            setId: x.id,
            repsCompleted: x.reps,
            weightUsed: unit === "kg" ? x.weight : x.weight / 2.20462,
          })),
      },
    });
  }

  const [unit, setUnit] = useState<Unit>("kg");
  const handleUnitSwitch = () => {
    setUnit((prevUnit) => (prevUnit === "kg" ? "lbs" : "kg"));
  };

  const closePopup = () => {
    setActiveExerciseDisplayPopup(false);
  };

  return (
    <div className="started-workout-container">
      <Async await={loaderData?.todaysWorkout}>
        {(workout) => {
          if (workout?.code !== "OK") return null;

          return (
            <>
              <EllipsisPopup
                isOpened={activeExerciseDisplayPopup}
                handleUnitSwitch={handleUnitSwitch}
                currentUnit={unit}
                closePopup={closePopup}
                ellipsisButtonRef={ellipsisButtonRef}
              />

              <div className="started-workout-header">
                <h1>{workout.content.name}</h1>

                <div className="buttons-container">
                  <button onClick={handleSaveBtnClick} className="save-button">
                    Save
                  </button>

                  <button
                    ref={ellipsisButtonRef}
                    onClick={() =>
                      setActiveExerciseDisplayPopup((prevState) => !prevState)
                    }
                    className="ellipsis-button"
                  >
                    <Icon name="ellipsis-vertical" />
                  </button>
                </div>
              </div>

              <Inner
                workout={workout.content}
                completedSets={completedSets}
                setCompletedSets={setCompletedSets}
                unit={unit}
              />

              <ConfirmModalDialog
                isOpen={isConfirmationDialogOpen}
                onConfirm={() => save()?.then(() => navigate(-1))}
                onDeny={() => setIsConfirmationDialogOpen(false)}
                confirmBtnText="Finish"
                denyBtnText={
                  validationStatus.status === "valid"
                    ? "Not yet"
                    : validationStatus.completedPercent >= 50
                    ? "Keep pushing"
                    : "Keep going"
                }
              >
                {validationStatus.status === "valid" ? (
                  <>
                    <span>Congratulations on completing your workout!</span>
                    <span>Are you ready to finish and save your progress?</span>
                  </>
                ) : validationStatus.completedPercent >= 50 ? (
                  <>
                    <span>You're almost there!</span>
                    <span>You still have some sets remaining.</span>
                    <span>
                      Would you like to finish or keep pushing through?
                    </span>
                  </>
                ) : (
                  <>
                    <span>Great effort!</span>
                    <span>You've completed part of your workout.</span>
                    <span>Do you want to finish now or keep going?</span>
                  </>
                )}
              </ConfirmModalDialog>
            </>
          );
        }}
      </Async>
    </div>
  );
}

export type CompletedSet = {
  id: string;
  sets: {
    id: string;
    reps: number;
    weight: number;
  }[];
};

type StartedWorkoutCarouselProps = {
  workout: Schema<"DetailedWorkoutResponseDTO">;
  completedSets: CompletedSet[];
  setCompletedSets: Dispatch<SetStateAction<CompletedSet[]>>;
  unit: Unit;
};

function Inner({
  workout,
  completedSets,
  setCompletedSets,
  unit,
}: StartedWorkoutCarouselProps) {
  const sets = useMemo(() => extractSetsNoMapping(workout), [workout]);

  const items = sets.map((x) => (
    <StartedWorkoutSet
      set={x}
      key={x.id}
      completedInfo={completedSets.find((y) => y.id === x.id) ?? null}
      setCompletedInfo={(set) => {
        setCompletedSets((sets) => {
          const currentIndex = sets.findIndex((x) => x.id === set.id);
          if (currentIndex >= 0) sets[currentIndex] = set;
          else sets.push(set);

          return sets.slice();
        });
      }}
      unit={unit}
    />
  ));

  return <div className="started-workout-sets-container">{items}</div>;
}

type ExerciseDisplayPopupProps = {
  isOpened: boolean;
  handleUnitSwitch: () => void;
  currentUnit: "kg" | "lbs";
  closePopup: () => void;
  ellipsisButtonRef: React.RefObject<HTMLButtonElement>;
};

function EllipsisPopup({
  isOpened,
  handleUnitSwitch,
  currentUnit,
  closePopup,
  ellipsisButtonRef,
}: ExerciseDisplayPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useOutsideClick([popupRef, ellipsisButtonRef], closePopup);

  const nextUnit = currentUnit === "kg" ? "lbs" : "kg";

  return (
    <div className={`ellipsis-popup ${!isOpened && "closed"}`} ref={popupRef}>
      <button onClick={handleUnitSwitch}>Switch to {nextUnit}</button>
    </div>
  );
}
