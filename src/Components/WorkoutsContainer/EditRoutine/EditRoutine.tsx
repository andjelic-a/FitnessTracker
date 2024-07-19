import { useState } from "react";
import useLoaderData from "../../../BetterRouter/UseLoaderData";
import Async from "../../Async/Async";
import WindowFC from "../../WindowWrapper/WindowFC";
import routineDisplayLoader from "../../RoutineDisplay/RoutineDisplayLoader";

const EditRoutine = WindowFC(({}, wrapperRef) => {
  const loaderData = useLoaderData<typeof routineDisplayLoader>();
  const [updatedWorkout, setUpdatedWorkout] = useState<Awaited<
    typeof loaderData.routine
  > | null>(null);

  return (
    <Async await={loaderData?.routine}>
      {(originalWorkout) => {
        return <div ref={wrapperRef}>{JSON.stringify(originalWorkout)}</div>;
      }}
    </Async>
  );
});

export default EditRoutine;
