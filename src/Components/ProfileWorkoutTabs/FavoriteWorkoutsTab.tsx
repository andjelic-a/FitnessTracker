import { memo, useMemo } from "react";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import { Request } from "../../Types/Endpoints/RequestParser";

type FavoriteWorkoutsTabProps = {
  searchTerm: string;
};

const FavoriteWorkoutsTab = memo<FavoriteWorkoutsTabProps>(({ searchTerm }) => {
  const request = useMemo<Request<"/api/workout/favorite/simple">>(
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
        endpoint={"/api/workout/favorite/simple"}
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
      />
    ),
    [request]
  );

  return <>{tab}</>;
});

export default FavoriteWorkoutsTab;
