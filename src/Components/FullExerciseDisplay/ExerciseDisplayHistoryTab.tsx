import { memo, useContext } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";

type ExerciseDisplayHistoryTabProps = {
  exercise: Schema<"DetailedExerciseResponseDTO">;
};

const ExerciseDisplayHistoryTab = memo(
  ({ exercise }: ExerciseDisplayHistoryTabProps) => {
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
            //The outer div represents a completed workout which contains the date of completion and all sets that the user completed of this exercise
            <div
              key={completedWorkout.completionDate}
              className="completed-workout"
            >
              <p className="date">{completedWorkout.completionDate}</p>

              {/* Inner div represents a single completed set which contains the reps and weight */}
              {completedWorkout.setsCompleted.map((completedSet, i) => (
                <div key={i} className="completed-set">
                  <p>
                    {completedSet.weight}x{completedSet.reps}
                  </p>
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
);

export default ExerciseDisplayHistoryTab;
