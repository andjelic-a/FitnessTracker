import "./StartedWorkout.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import startedWorkoutLoader from "./StartedWorkoutLoader";
import Async from "../../Components/Async/Async";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { extractSetsNoMapping } from "../../Utility/ExtractSetsFromWorkout";
import StartedWorkoutSet from "./StartedWorkoutSet";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { useNavigate } from "react-router-dom";
import ConfirmModalDialog from "../../Components/ConfirmModalDialog/ConfirmModalDialog";

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
    return sendAPIRequest("/api/user/me/split/today/completeworkout", {
      method: "post",
      payload: {
        completedSets: completedSets
          .flatMap((x) => x.sets)
          .map((x) => ({
            setId: x.id,
            repsCompleted: x.reps,
            weightUsed: x.weight,
          })),
      },
    });
  }

  return (
    <div className="started-workout-container">
      <Async await={loaderData?.todaysWorkout}>
        {(workout) => {
          if (workout?.code !== "OK") return null;

          return (
            <>
              <StartedWorkoutCarousel
                workout={workout.content}
                completedSets={completedSets}
                setCompletedSets={setCompletedSets}
              />

              <button onClick={handleSaveBtnClick} className="save-button">
                Save
              </button>

              <ConfirmModalDialog
                isOpen={isConfirmationDialogOpen}
                onConfirm={async () => {
                  await save();
                  navigate(-1);
                }}
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
};

function StartedWorkoutCarousel({
  workout,
  completedSets,
  setCompletedSets,
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
    />
  ));

  return (
    <AliceCarousel
      keyboardNavigation
      items={items}
      renderPrevButton={({ isDisabled }) => (
        <button className="prev-button" disabled={isDisabled}>
          Prev
        </button>
      )}
      renderNextButton={({ isDisabled }) => (
        <button className="next-button" disabled={isDisabled}>
          Next
        </button>
      )}
    />
  );
}
