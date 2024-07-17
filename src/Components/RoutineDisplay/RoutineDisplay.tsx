import "./RoutineDisplay.scss";
import { Suspense, useRef, useState } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import Icon from "../Icon/Icon";
import RoutineDisplayItem from "./RoutineDisplayItem/RoutineDisplayItem";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import WindowWrapper from "../WindowWrapper/WindowWrapper";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

export default function RoutineDisplay() {
  const [thumbsUpActive, setThumbsUpActive] = useState<boolean>(false);
  const [commentActive, setCommentActive] = useState<boolean>(false);
  const [favoriteActive, setFavoriteActive] = useState<boolean>(false);

  const routineDisplayRef = useRef<HTMLDivElement>(null);

  const data = useLoaderData() as {
    routine: Promise<APIResponse<"/api/workout/{id}/detailed", "get">>;
  };

  const navigate = useNavigate();

  useOutsideClick(routineDisplayRef, () => navigate("/me"), "left");

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
    <WindowWrapper>
      <div ref={routineDisplayRef} className={`routine-display visible`}>
        <div className="routine-display-header">
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={data?.routine}>
              {(routine: Awaited<typeof data.routine>) => {
                if (!routine || routine.code !== "OK") return null;

                return (
                  <>
                    <p className="routine-display-title">
                      {routine.content.name}
                    </p>
                    <button className="routine-display-edit" onClick={() => {}}>Edit</button>
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>

        <div className="routine-display-body">
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={data?.routine}>
              {(routine: Awaited<typeof data.routine>) => {
                if (!routine || routine.code !== "OK") return null;

                return (
                  <>
                    {routine.content.exercises.map((exercise) => (
                      <RoutineDisplayItem
                        key={exercise.id}
                        name={exercise.name}
                        image={exercise.image}
                        sets={routine.content.sets.filter(
                          (set) => set.exerciseId === exercise.id
                        )}
                      />
                    ))}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>

        <div className="routine-display-footer">
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={data?.routine}>
              {(routine: Awaited<typeof data.routine>) => {
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
            </Await>
          </Suspense>
        </div>
        <div className="routine-display-comment-popup">dasdas</div>
      </div>
    </WindowWrapper>
  );
}
