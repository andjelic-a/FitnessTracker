import { useState } from "react";
import Icon from "../../Components/Icon/Icon";
import InputField from "../../Components/InputField/InputField";
import "./WorkoutsContainer.scss";
import useSearch from "../../Hooks/UseSearch";

interface Workout {
  id: string;
  name: string;
  image: string | null;
}

interface WorkoutsContainerProps {
  workouts: Workout[];
  toggleNewWorkoutWindow: () => void;
}

const WorkoutsContainer: React.FC<WorkoutsContainerProps> = ({
  workouts,
  toggleNewWorkoutWindow,
}) => {
  const search = useSearch(workouts.slice(), (x) => x.name);
  const [showAll, setShowAll] = useState<boolean>(false);

  const [searchResults, setSearchResults] = useState<Workout[] | null>(null);

  const toggleShowAll = () => {
    setShowAll((prevState) => !prevState);
  };

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
          onChange={(e) => {
            if (e.target.value === "") {
              setSearchResults(null);
              return;
            }

            const results = search(e.target.value, workouts.length / 2);
            setSearchResults(results);
          }}
        />
        <div className="profile-workouts-items-container">
          {(searchResults ?? (showAll ? workouts : workouts.slice(0, 8))).map(
            (workout) => (
              <div key={workout.id}>
                {/* Replace with actual image path */}
                <img
                  src={workout.image ?? "../../../DefaultProfilePicture.png"}
                  alt={workout.name}
                />
                <p>{workout.name}</p>
              </div>
            )
          )}
          {workouts.length > 8 && !searchResults && (
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
