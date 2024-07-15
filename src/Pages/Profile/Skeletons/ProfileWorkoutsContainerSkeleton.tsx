import { v4 } from "uuid";
import Icon from "../../../Components/Icon/Icon";
import InputField from "../../../Components/InputField/InputField";
import "../../../Components/WorkoutsContainer/WorkoutsContainer.scss";

export default function ProfileWorkoutsContainerSkeleton() {
  return (
    <div className="profile-workouts-container">
      <div className="profile-workouts-header">
        <h1>Workouts</h1>
        <button>
          <Icon className="icon" name="plus" />
          New
        </button>
      </div>
      <div className="profile-workouts-body">
        <InputField
          className="profile-workouts-search"
          placeholder="Search workouts"
          disabled
        />
        <div className="profile-workouts-items-container">
          {new Array(8).fill(0).map(() => (
            <div
              key={v4()}
              style={{
                filter: "blur(3px)",
              }}
            >
              <img
                src={"/DefaultProfilePicture.png"}
                alt={"Placeholder image while loading"}
              />
              <p>{v4().slice(0, Math.random() * 10 + 15)}</p>
            </div>
          ))}
          <button className="profile-workouts-show">Show more</button>
        </div>
      </div>
    </div>
  );
}
