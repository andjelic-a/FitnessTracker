import { memo, useMemo } from "react";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import { Request } from "../../Types/Endpoints/RequestParser";

const FavoriteWorkoutsTab = memo(() => {
  const request = useMemo<Request<"/api/workout/favorite/simple">>(
    () => ({
      method: "get",
      parameters: {
        limit: 10,
        offset: 0,
      },
    }),
    []
  );

  const tab = useMemo(
    () => (
      <LazyLoadingContainer
        endpoint={"/api/workout/favorite/simple"}
        baseAPIRequest={request}
        onSegmentLoad={(workouts) => {
          console.log(workouts);

          if (workouts.code !== "OK" || workouts.content.length === 0)
            return <p className="empty">asdsd...</p>;

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
      />
    ),
    []
  );

  return <>{tab}</>;
});

export default FavoriteWorkoutsTab;
