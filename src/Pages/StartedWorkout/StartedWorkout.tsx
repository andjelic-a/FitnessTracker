import "./StartedWorkout.scss";
import WindowFC from "../../Components/WindowWrapper/WindowFC";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import startedWorkoutLoader from "./StartedWorkoutLoader";
import Async from "../../Components/Async/Async";

const StartedWorkout = WindowFC(() => {
  const loaderData = useLoaderData<typeof startedWorkoutLoader>();

  return (
    <div className="started-workout">
      <Async await={loaderData?.todaysWorkout}>
        {(workout) => {
          if (workout?.code !== "OK") return null;

          return <>{JSON.stringify(workout)}</>;
        }}
      </Async>
    </div>
  );
});

export default StartedWorkout;
