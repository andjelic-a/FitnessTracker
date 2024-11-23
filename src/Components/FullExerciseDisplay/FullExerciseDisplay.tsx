import "./FullExerciseDisplay.scss";
import { useState } from "react";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import singleExerciseLoader from "./SingleExerciseLoader";
import Async from "../Async/Async";
import Icon from "../Icon/Icon";
import ExerciseDisplaySummeryTab from "./ExerciseDisplaySummeryTab";
import ExerciseDisplayHistoryTab from "./ExerciseDisplayHistoryTab";
import ExerciseDisplayHowToTab from "./ExerciseDisplayHowToTab";
import { useNavigate } from "react-router-dom";

export default function FullExerciseDisplay() {
  const data = useLoaderData<typeof singleExerciseLoader>();

  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();

  return (
    <Async await={data.exercise}>
      {(exercise) => {
        if (exercise.code !== "OK") return null;

        return (
          <div className="full-exercise-display">
            <div className="full-exercise-display-header">
              <button
                onClick={() => navigate(-1)}
                className="full-exercise-display-header-arrow"
              >
                <Icon name="arrow-left" />
              </button>

              <button
                onClick={() => console.log("dot dot dot")}
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
                <ExerciseDisplaySummeryTab exercise={exercise.content} />
              )}

              {activeTab === 1 && (
                <ExerciseDisplayHistoryTab exercise={exercise.content} />
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
