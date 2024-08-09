import { useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Async from "../Async/Async";
import WorkoutCarousel from "../WorkoutCarousel/WorkoutCarousel";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import "./ProfileWorkoutTabs.scss";

type ProfileWorkoutTabsProps = {
  initialCreatedWorkouts: Promise<Schema<"SimpleWorkoutResponseDTO">[]>;
};

type Tabs = "created" | "favorite" | "liked";

export default function ProfileWorkoutTabs({
  initialCreatedWorkouts,
}: ProfileWorkoutTabsProps) {
  const [openTab, setOpenTab] = useState<Tabs>("created");

  return (
    <div className="profile-workout-tabs-container">
      <div className="tabs-header">
        <div className="tab">
          <button onClick={() => setOpenTab("created")}>Created</button>
          {openTab === "created" && <div className="active-indicator" />}
        </div>

        <div className="tab">
          <button onClick={() => setOpenTab("favorite")}>Favorite</button>
          {openTab === "favorite" && <div className="active-indicator" />}
        </div>

        <div className="tab">
          <button onClick={() => setOpenTab("liked")}>Liked</button>
          {openTab === "liked" && <div className="active-indicator" />}
        </div>
      </div>

      <div className="tabs-body">
        <WorkoutCarousel>
          <Async await={initialCreatedWorkouts}>
            {(workouts) => (
              <>
                {workouts.map((x) => (
                  <WorkoutPreview key={x.id} workout={x} />
                ))}
              </>
            )}
          </Async>
        </WorkoutCarousel>
      </div>
    </div>
  );
}
