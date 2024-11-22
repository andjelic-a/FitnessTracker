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
            <div
              key={completedWorkout.completionDate}
              className="full-exercise-display-history"
            >
              <div className="full-exercise-display-history-header">
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="full-exercise-display-history-image"
                />
                <h3>{exercise.name}</h3>
              </div>

              <div className="full-exercise-display-history-sets">
                {completedWorkout.setsCompleted.map((completedSet, index) => (
                  <div key={index} className="full-exercise-display-history-completed-set">
                    <p>
                      {index + 1} {completedSet.weight} x {completedSet.reps}
                    </p>
                  </div>
                ))}
              </div>
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
