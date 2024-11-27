import "./FullExerciseDisplay.scss";
import { useState, useRef, useEffect } from "react";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import singleExerciseLoader from "./SingleExerciseLoader";
import Async from "../Async/Async";
import Icon from "../Icon/Icon";
import ExerciseDisplaySummeryTab from "./ExerciseDisplaySummeryTab";
import ExerciseDisplayHistoryTab from "./ExerciseDisplayHistoryTab";
import ExerciseDisplayHowToTab from "./ExerciseDisplayHowToTab";
import { useNavigate } from "react-router-dom";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../Data/SendAPIRequest";

export default function FullExerciseDisplay() {
  const data = useLoaderData<typeof singleExerciseLoader>();
  const [activeExerciseDisplayPopup, setActiveExerciseDisplayPopup] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const navigate = useNavigate();

  const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

  const handleUnitSwitch = () => {
    setUnit((prevUnit) => (prevUnit === "kg" ? "lbs" : "kg"));
  };

  const closePopup = () => {
    setActiveExerciseDisplayPopup(false);
  };

  return (
    <Async await={data.exercise}>
      {(exercise) => {
        if (exercise.code !== "OK") return null;

        return (
          <div className="full-exercise-display">
            <ExerciseDisplayPopup
              exercise={exercise.content}
              isOpened={activeExerciseDisplayPopup}
              handleUnitSwitch={handleUnitSwitch}
              currentUnit={unit}
              closePopup={closePopup}
              ellipsisButtonRef={ellipsisButtonRef}
            />

            <div className="full-exercise-display-header">
              <button
                onClick={() => navigate(-1)}
                className="full-exercise-display-header-arrow"
              >
                <Icon name="arrow-left" />
              </button>

              <button
                ref={ellipsisButtonRef}
                onClick={() =>
                  setActiveExerciseDisplayPopup((prevState) => !prevState)
                }
                className="full-exercise-display-header-ellipsis"
              >
                <Icon name="ellipsis" />
              </button>

              <div className="full-exercise-display-header-tabs-container">
                <button
                  className="full-exercise-display-header-tab"
                  onClick={() => setActiveTab(0)}
                >
                  <p>Summary</p>
                </button>

                <button
                  className="full-exercise-display-header-tab"
                  onClick={() => setActiveTab(1)}
                >
                  <p>History</p>
                </button>

                <button
                  className="full-exercise-display-header-tab"
                  onClick={() => setActiveTab(2)}
                >
                  <p>How to</p>
                </button>

                <div
                  className="full-exercise-display-header-tab-indicator"
                  style={{ left: `${(100 / 3) * activeTab}%` }}
                />
              </div>
            </div>

            {(activeTab === 0 || activeTab === 2) && (
              <div className="full-exercise-display-image">
                <img
                  src={exercise.content.image ?? ""}
                  alt="Image of the exercise"
                />
              </div>
            )}

            <div
              className={`full-exercise-display-body ${
                activeTab === 1 && "history-tab-active"
              }`}
            >
              {activeTab === 0 && (
                <ExerciseDisplaySummeryTab
                  exercise={exercise.content}
                  unit={unit}
                />
              )}
              {activeTab === 1 && (
                <ExerciseDisplayHistoryTab
                  exercise={exercise.content}
                  unit={unit}
                />
              )}
              {activeTab === 2 && (
                <ExerciseDisplayHowToTab exercise={exercise.content} />
              )}
            </div>
          </div>
        );
      }}
    </Async>
  );
}

type ExerciseDisplayPopupProps = {
  isOpened: boolean;
  handleUnitSwitch: () => void;
  currentUnit: "kg" | "lbs";
  closePopup: () => void;
  ellipsisButtonRef: React.RefObject<HTMLButtonElement>;
  exercise: Schema<"DetailedExerciseResponseDTO">;
};

function ExerciseDisplayPopup({
  isOpened,
  handleUnitSwitch,
  currentUnit,
  closePopup,
  ellipsisButtonRef,
  exercise,
}: ExerciseDisplayPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useOutsideClick([popupRef, ellipsisButtonRef], closePopup);

  const nextUnit = currentUnit === "kg" ? "lbs" : "kg";
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => setIsFavorite(exercise.isFavorite), [exercise]);

  function handleFavorite() {
    sendAPIRequest("/api/exercise/{id}/favorite", {
      method: isFavorite ? "delete" : "post",
      parameters: {
        id: exercise.id,
      },
    }).then(
      (x) =>
        (x.code === "Created" || x.code === "No Content") &&
        void setIsFavorite(!isFavorite)
    );
  }

  return (
    <div
      className={`exercise-display-popup ${!isOpened && "closed"}`}
      ref={popupRef}
    >
      <button onClick={handleUnitSwitch}>Switch to {nextUnit}</button>
      <button onClick={handleFavorite}>
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </button>
    </div>
  );
}
