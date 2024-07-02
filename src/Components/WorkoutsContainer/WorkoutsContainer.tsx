import { useState } from "react";
import Icon from "../../Components/Icon/Icon";
import InputField from "../../Components/InputField/InputField";
import "./WorkoutsContainer.scss";

interface Workout {
  id: string;
  name: string;
  image: any;
}

interface WorkoutsContainerProps {
  workouts: Workout[];
}

const WorkoutsContainer: React.FC<WorkoutsContainerProps> = ({ workouts }) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const displayedWorkouts = showAll ? workouts : workouts.slice(0, 8);

  const toggleShowAll = () => {
    setShowAll((prevState) => !prevState);
  };

  return (
    <div className="profile-workouts-container">
      <div className="profile-workouts-header">
        <h1>Workouts</h1>
        <button>
          <Icon className="icon" name="plus" />
          <p>New</p>
        </button>
      </div>
      <div className="profile-workouts-body">
        <InputField
          className="profile-workouts-search"
          placeholder="Search workouts"
        />
        <div className="profile-workouts-items-container">
          {displayedWorkouts.map((workout) => (
            <div key={workout.id}>
              {/* Replace with actual image path */}
              <img src={workout.image} alt={workout.name} />
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
};

export default WorkoutsContainer;