import { memo } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import WorkoutCarousel from "../WorkoutCarousel/WorkoutCarousel";
import Async from "../Async/Async";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";

type WorkoutTabProps = {
  initialWorkouts: Promise<Schema<"SimpleWorkoutResponseDTO">[]>;
};

const WorkoutTab = memo<WorkoutTabProps>(({ initialWorkouts }) => {
  console.log("rerender");

  return (
    <>
      <WorkoutCarousel>
        <Async await={initialWorkouts}>
          {(workouts) => {
            if (workouts.length === 0)
              return <p className="empty">Nothing to see here...</p>;

            return (
              <>
                {workouts.map((x) => (
                  <WorkoutPreview key={x.id} workout={x} />
                ))}
              </>
            );
          }}
        </Async>
      </WorkoutCarousel>
    </>
  );
});

export default WorkoutTab;
