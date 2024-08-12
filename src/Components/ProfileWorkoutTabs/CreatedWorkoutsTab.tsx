import { memo, useContext, useMemo } from "react";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import { Request } from "../../Types/Endpoints/RequestParser";
import { NewWorkoutsContext } from "../WorkoutsContainer/CreateRoutine/NewWorkoutsContext";

type CreatedWorkoutsTabProps = {
  searchTerm: string;
};

const CreatedWorkoutsTab = memo<CreatedWorkoutsTabProps>(({ searchTerm }) => {
  const navigate = useNavigate();
  const newWorkoutsContext = useContext(NewWorkoutsContext);

  const request = useMemo<Request<"/api/workout/personal/simple">>(
    () => ({
      method: "get",
      parameters: {
        limit: 10,
        offset: 0,
        name: searchTerm !== "" ? searchTerm : undefined,
      },
    }),
    [searchTerm]
  );

  const tab = useMemo(
    () => (
      <LazyLoadingContainer
        endpoint={"/api/workout/personal/simple"}
        baseAPIRequest={request}
        onSegmentLoad={(workouts) => {
          if (workouts.code !== "OK" || workouts.content.length === 0)
            return <p className="empty">Nothing to see here...</p>;

          return (
            <>
              {workouts.content.map((x) => (
                <WorkoutPreview key={x.id} workout={x} />
              ))}
            </>
          );
        }}
        stopCondition={(response) =>
          response.code === "Unauthorized" ||
          response.code === "Forbidden" ||
          (response.code === "OK" && response.content.length < 10)
        }
        before={
          <>
            <button
              className="new-workout-btn"
              onClick={() => void navigate("workout/new")}
            >
              <p aria-hidden={false} className="accessibility-only">
                Create a new workout
              </p>

              <Icon aria-hidden={true} name="plus" />
            </button>

            {newWorkoutsContext.createdWorkouts.map((x) => (
              <WorkoutPreview key={x.id} workout={x} />
            ))}
          </>
        }
      />
    ),
    [newWorkoutsContext.createdWorkouts, request]
  );

  return <>{tab}</>;
});

export default CreatedWorkoutsTab;
