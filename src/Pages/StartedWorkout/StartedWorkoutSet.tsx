import { extractSetsNoMapping } from "../../Utility/ExtractSetsFromWorkout";

type StartedWorkoutSetProps = {
  set: ReturnType<typeof extractSetsNoMapping>[number];
};

export default function StartedWorkoutSet({ set }: StartedWorkoutSetProps) {
  return <div>StartedWorkoutSet</div>;
}
