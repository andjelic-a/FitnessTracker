import { useState } from "react";
import Icon from "../../Components/Icon/Icon";
import InputField from "../../Components/InputField/InputField";
import "./WorkoutsContainer.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import useSearch from "../../Hooks/UseSearch";

type WorkoutsContainerProps = {
  workouts: Schema<"SimpleWorkoutResponseDTO">[];
  toggleNewWorkoutWindow: () => void;
};

function WorkoutsContainer({
  workouts,
  toggleNewWorkoutWindow,
}: WorkoutsContainerProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const search = useSearch(workouts.slice(), (x) => x.name);
  const [searchResults, setSearchResults] = useState<
    Schema<"SimpleWorkoutResponseDTO">[] | null
  >(null);

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
                <img
                  src={workout.creator.image ?? "/DefaultProfilePicture.png"}
                  alt={"Profile picture of the creator of " + workout.name}
                />
                <p>{workout.name}</p>
              </div>
            )
          )}
          {(searchResults ?? workouts).length > 8 && (
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
