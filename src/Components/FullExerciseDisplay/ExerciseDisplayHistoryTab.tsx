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
      <div className="full-exercise-display-history">
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
                className="full-exercise-display-history-item"
              >
                <div className="full-exercise-display-history-header">
                  <div className="full-exercise-display-history-image-container">
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="full-exercise-display-history-image"
                    />
                  </div>
                  <h3>{exercise.name}</h3>
                  <p>{new Date(completedWorkout.completionDate).toLocaleDateString()}</p>
                </div>

                <div className="full-exercise-display-history-set-seactions">
                  <p>SET</p>
                  <p>WEIGHT & REPS</p>
                </div>
                <div className="full-exercise-display-history-sets">
                  {completedWorkout.setsCompleted.map((completedSet, index) => (
                    <div
                      key={index}
                      className="full-exercise-display-history-completed-set"
                    >
                      <p>{index + 1}</p>
                      <p>
                        {completedSet.weight} x {completedSet.reps}
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
      </div>
    );
  }
);

export default ExerciseDisplayHistoryTab;
