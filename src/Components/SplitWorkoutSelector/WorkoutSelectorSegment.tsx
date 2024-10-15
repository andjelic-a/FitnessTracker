import { Schema } from "../../Types/Endpoints/SchemaParser";
import Async from "../Async/Async";
import WorkoutSelectorOption from "./WorkoutSelectorOption";

type WorkoutSelectorSegmentProps = {
  workouts: Promise<Schema<"SimpleWorkoutOptionResponseDTO">[]>;
  selectedWorkout: Schema<"SimpleWorkoutOptionResponseDTO"> | null;
  onSelectWorkout: (workout: Schema<"SimpleWorkoutOptionResponseDTO">) => void;
};

export default function WorkoutSelectorSegment({
  workouts,
  selectedWorkout,
  onSelectWorkout,
}: WorkoutSelectorSegmentProps) {
  return (
    <Async await={workouts}>
      {(workouts) =>
        workouts.map((workout) => (
          <WorkoutSelectorOption
            key={workout.id}
            workout={workout}
            isSelected={
              selectedWorkout !== null && selectedWorkout.id === workout.id
            }
            onSelectWorkout={onSelectWorkout}
          />
        ))
      }
    </Async>
  );
}
