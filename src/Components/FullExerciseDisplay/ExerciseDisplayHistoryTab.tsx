import { useContext } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

type ExerciseDisplayHistoryTabProps = {
  exercise: Schema<"DetailedExerciseResponseDTO">;
};

export default function ExerciseDisplayHistoryTab({
  exercise,
}: ExerciseDisplayHistoryTabProps) {
  const basicInfo = useContext(basicProfileInfoContext);

  return basicInfo === null ? (
    <div>Login to view exercise history</div>
  ) : (
    <LazyLoadingContainer
      endpoint="/api/exercise/{id}/history"
      baseAPIRequest={{
        method: "get",
        parameters: {
          id: exercise.id,
          offset: 0,
          limit: 10,
        },
      }}
      onSegmentLoad={(segmentData) => {
        if (segmentData.code !== "OK") return null;

        return segmentData.content.map((completedWorkout) => (
          <div key={completedWorkout.completionDate}>
            {completedWorkout.completionDate}
            {completedWorkout.setsCompleted.map((completedSet, i) => (
              <div key={i}>
                {completedSet.weight}x{completedSet.reps}
              </div>
            ))}
          </div>
        ));
      }}
      stopCondition={(segmentData) =>
        segmentData.code === "Not Found" ||
        (segmentData.code === "OK" && segmentData.content.length < 10)
      }
    />
  );
}
