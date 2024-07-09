import { useState } from "react";
import Icon from "../../Components/Icon/Icon";
import InputField from "../../Components/InputField/InputField";
import "./WorkoutsContainer.scss";

type Workout = {
  id: string;
  name: string;
  image: string | null;
};

type WorkoutsContainerProps = {
  workouts: Workout[];
  toggleNewWorkoutWindow: () => void;
};

function WorkoutsContainer({
  workouts,
  toggleNewWorkoutWindow,
}: WorkoutsContainerProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const toggleShowAll = () => void setShowAll((prevState) => !prevState);

  return (
    <div className="profile-workouts-container">
      <div className="profile-workouts-header">
        <h1>Workouts</h1>
        <button onClick={toggleNewWorkoutWindow}>
          <Icon className="icon" name="plus" />
          New
        </button>
      </div>
      <div className="profile-workouts-body">
        <InputField
          className="profile-workouts-search"
          placeholder="Search workouts"
        />
        <div className="profile-workouts-items-container">
          {(showAll ? workouts : workouts.slice(0, 8)).map((workout) => (
            <div key={workout.id}>
              <img
                src={workout.image ?? "/DefaultProfilePicture.png"}
                alt={"Profile picture of the creator of " + workout.name}
              />
              <p>{workout.name}</p>
            </div>
          ))}
          {workouts.length > 8 && (
            <button className="profile-workouts-show" onClick={toggleShowAll}>
              {showAll ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkoutsContainer;
