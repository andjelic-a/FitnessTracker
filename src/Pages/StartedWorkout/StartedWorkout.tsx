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

export default function StartedWorkout() {
  const loaderData = useLoaderData<typeof startedWorkoutLoader>();
  const [completedSets, setCompletedSets] = useState<CompletedSet[]>([]);
  const navigate = useNavigate();
  const sentRequest = useRef(false);

  async function handleSave() {
    if (sentRequest.current) return;
    sentRequest.current = true;

    await sendAPIRequest("/api/user/me/split/today/completeworkout", {
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

    navigate(-1);
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

              <button onClick={handleSave} className="save-button">
                Save
              </button>
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
