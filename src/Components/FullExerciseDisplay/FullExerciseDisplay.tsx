import "./FullExerciseDisplay.scss";
import { useState } from "react";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import singleExerciseLoader from "./SingleExerciseLoader";
import Async from "../Async/Async";
import Icon from "../Icon/Icon";
import ExerciseDisplaySummeryTab from "./ExerciseDisplaySummeryTab";
import ExerciseDisplayHistoryTab from "./ExerciseDisplayHistoryTab";
import ExerciseDisplayHowToTab from "./ExerciseDisplayHowToTab";

export default function FullExerciseDisplay() {
  const data = useLoaderData<typeof singleExerciseLoader>();

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <Async await={data.exercise}>
      {(exercise) => {
        if (exercise.code !== "OK") return null;

        return (
          <div className="full-exercise-display">
            <div className="full-exercise-display-header">
              <Icon
                name="arrow-left"
                className="full-exercise-display-header-arrow"
              />
              <Icon
                name="ellipsis"
                className="full-exercise-display-header-ellipsis"
              />
              <div className="full-exercise-display-header-tabs-container">
                <div
                  className="full-exercise-display-header-tab"
                  onClick={() => setActiveTab(0)}
                >
                  <p>Summary</p>
                </div>
                <div
                  className="full-exercise-display-header-tab"
                  onClick={() => setActiveTab(1)}
                >
                  <p>History</p>
                </div>
                <div
                  className="full-exercise-display-header-tab"
                  onClick={() => setActiveTab(2)}
                >
                  <p>How to</p>
                </div>
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

            <div className="full-exercise-display-body">
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
