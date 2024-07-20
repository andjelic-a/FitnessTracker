import "./RoutineDisplay.scss";
import { useState } from "react";
import Icon from "../Icon/Icon";
import RoutineDisplayItem from "./RoutineDisplayItem/RoutineDisplayItem";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import routineDisplayLoader from "./RoutineDisplayLoader";
import Async from "../Async/Async";
import WindowFC from "../WindowWrapper/WindowFC";
import { useNavigate } from "react-router-dom";
import { extractSetsNoMapping } from "../WorkoutsContainer/EditRoutine/ExtractSetsFromWorkout";

const RoutineDisplay = WindowFC(({}, routineDisplayRef) => {
  const navigate = useNavigate();

  const [thumbsUpActive, setThumbsUpActive] = useState<boolean>(false);
  const [commentActive, setCommentActive] = useState<boolean>(false);
  const [favoriteActive, setFavoriteActive] = useState<boolean>(false);

  const data = useLoaderData<typeof routineDisplayLoader>();

  const handleThumbsUpClick = () => {
    setThumbsUpActive((prevState) => !prevState);
  };

  const handleCommentClick = () => {
    setCommentActive((prevState) => !prevState);
  };

  const handleFavoriteClick = () => {
    setFavoriteActive((prevState) => !prevState);
  };

  return (
    <div ref={routineDisplayRef} className={`routine-display visible`}>
      <div className="routine-display-header">
        <Async await={data?.routine}>
          {(routine) => {
            if (!routine || routine.code !== "OK") return null;

            return (
              <>
                <p className="routine-display-title">{routine.content.name}</p>
                <button
                  className="routine-display-edit"
                  onClick={() => void navigate("edit")}
                >
                  Edit
                </button>
              </>
            );
          }}
        </Async>
      </div>

      <div className="routine-display-body">
        <Async await={data?.routine}>
          {(routine) => {
            if (!routine || routine.code !== "OK") return null;

            return (
              <>
                {extractSetsNoMapping(routine.content).map((set) => (
                  <RoutineDisplayItem
                    key={set.id}
                    exercise={set.exercise}
                    sets={set.sets}
                  />
                ))}
              </>
            );
          }}
        </Async>
      </div>

      <div className="routine-display-footer">
        <Async await={data?.routine}>
          {(routine) => {
            if (!routine || routine.code !== "OK") return null;

            return (
              <>
                {routine.content.description?.trim() !== "" ||
                  (routine.content.description && (
                    <div className="routine-display-description-container">
                      <div className="routine-display-description">
                        <label className="routine-display-description-placeholder">
                          Routine Description
                        </label>
                        {routine.content.description}
                      </div>
                    </div>
                  ))}
                <div className="icon-container">
                  <Icon
                    name="thumbs-up"
                    onClick={handleThumbsUpClick}
                    className={`routine-display-thumbs-up ${
                      thumbsUpActive ? "active" : ""
                    }`}
                  />
                  <Icon
                    onClick={handleCommentClick}
                    name="comment"
                    className={`routine-display-comment ${
                      commentActive ? "active" : ""
                    }`}
                  />
                  <Icon
                    name="bookmark"
                    onClick={handleFavoriteClick}
                    className={`routine-display-bookmark ${
                      favoriteActive ? "active" : ""
                    }`}
                  />
                </div>
              </>
            );
          }}
        </Async>
      </div>
      <div className="routine-display-comment-popup">Comments</div>
    </div>
  );
});

export default RoutineDisplay;
