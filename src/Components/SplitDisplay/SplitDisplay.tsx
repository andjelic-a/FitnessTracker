import "./SplitDisplay.scss";
import WindowFC from "../WindowWrapper/WindowFC";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import splitDisplayLoader from "./SplitDisplayLoader";
import Async from "../Async/Async";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import extractWorkoutsFromSplit from "../../Utility/ExtractWorkoutsFromSplit";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";

const SplitDisplay = WindowFC(() => {
  const loaderData = useLoaderData<typeof splitDisplayLoader>();
  const navigate = useNavigate();
  console.log(loaderData);

  return (
    <div className="split-display-container">
      <div className="split-display">
        <Async await={loaderData?.split}>
          {(split) => {
            if (split.code !== "OK") return null;

            return (
              <>
                <div className="split-display-header">
                  <p className="split-display-title">{split.content.name}</p>

                  <div className="buttons">
                    <button
                      className="split-display-edit"
                      onClick={() => void navigate("edit")}
                    >
                      <Icon name="pen-to-square" />

                      <p className="accessibility-only" aria-hidden={false}>
                        Edit
                      </p>
                    </button>

                    <button
                      className="split-display-delete"
                      // onClick={() => void setIsConfirmDeletionModalOpen(true)}
                    >
                      <Icon name="trash" />

                      <p className="accessibility-only" aria-hidden={false}>
                        Delete
                      </p>
                    </button>
                  </div>
                </div>

                <div className="split-display-body">
                  {extractWorkoutsFromSplit(split.content).map((workout) => (
                    <div className="workout" key={workout.day}>
                      <h1>{workout.day}</h1>

                      {workout.workout === null ? (
                        <p>Rest</p>
                      ) : (
                        <WorkoutPreview workout={workout.workout} />
                      )}
                    </div>
                  ))}
                </div>
              </>
            );
          }}
        </Async>
      </div>
    </div>
  );
});

export default SplitDisplay;
