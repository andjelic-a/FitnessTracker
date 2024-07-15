import "./ChooseExercise.scss";
import Icon from "../../../Icon/Icon";
import "./ChooseExercise.scss";
import Dropdown from "../../../DropdownMenu/Dropdown";
import { v4 } from "uuid";
import ExerciseOptionSkeleton from "./ExerciseOptionSkeleton";

export default function ChooseExerciseSkeleton() {
  return (
    <div className="choose-exercise" id="choose-exercise">
      <div className="choose-exercise-header">
        <h3>Choose Exercise</h3>
      </div>
      <div className="choose-exercise-body">
        <div className="choose-exercise-search-container">
          <div className="choose-exercise-search-bar-container">
            <Icon className="choose-exercise-search-bar-icon" name="search" />
            <input type="text" className="choose-exercise-search-bar" />
            <Icon
              className="choose-exercise-search-bar-icon arrow-right-icon"
              name="arrow-right"
            />
          </div>
          <div className="choose-exercise-filter">
            <Dropdown
              placeholder={"All muscles"}
              className="choose-exercise-filter-muscles-dropdown"
              children={null}
            />

            <Dropdown
              placeholder={"All equipment"}
              className="choose-exercise-filter-equipment-dropdown"
              children={null}
            />
          </div>
        </div>
        {new Array(10).fill(0).map(() => (
          <ExerciseOptionSkeleton key={v4()} />
        ))}
      </div>
      <div className="choose-exercise-footer">
        <button className="choose-exercise-button" disabled>
          Add
        </button>
        <button className={"choose-exercise-button"} disabled>
          More
        </button>
        <button className="choose-exercise-button" disabled>
          Cancel
        </button>
      </div>
    </div>
  );
}
