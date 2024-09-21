import "./StartedWorkout.scss";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import startedWorkoutLoader from "./StartedWorkoutLoader";
import Async from "../../Components/Async/Async";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/scss/alice-carousel.scss";
import { useMemo } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import extractSets, {
  extractSetsNoMapping,
} from "../../Utility/ExtractSetsFromWorkout";
import StartedWorkoutSet from "./StartedWorkoutSet";

export default function StartedWorkout() {
  const loaderData = useLoaderData<typeof startedWorkoutLoader>();

  return (
    <div className="started-workout-container">
      <Async await={loaderData?.todaysWorkout}>
        {(workout) => {
          if (workout?.code !== "OK") return null;

          return <StartedWorkoutCarousel workout={workout.content} />;
        }}
      </Async>
    </div>
  );
}

function StartedWorkoutCarousel({
  workout,
}: {
  workout: Schema<"DetailedWorkoutResponseDTO">;
}) {
  const items = useMemo(
    () =>
      extractSetsNoMapping(workout).map((x) => (
        <StartedWorkoutSet set={x} key={x.id} />
      )),
    [workout]
  );

  return (
    <AliceCarousel
      mouseTracking
      keyboardNavigation
      items={items}
      renderPrevButton={({ isDisabled }) => (
        <button disabled={isDisabled}>Prev</button>
      )}
      renderNextButton={({ isDisabled }) => (
        <button disabled={isDisabled}>Next</button>
      )}
      renderSlideInfo={({ item, itemsCount }) => `${item}\\${itemsCount}`}
    />
  );
}
