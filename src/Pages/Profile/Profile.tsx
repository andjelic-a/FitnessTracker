import { useState, Suspense } from "react";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import WorkoutsContainer from "../../Components/WorkoutsContainer/WorkoutsContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import CreateRoutine from "../../Components/WorkoutsContainer/CreateRoutine/CreateRoutine";
import { Await, useLoaderData } from "react-router-dom";
import "./Profile.scss";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

interface Workout {
  id: string;
  name: string;
  image: string | null;
}

export default function Profile() {
  const userData = useLoaderData() as {
    user: Promise<APIResponse<"/api/user/me/detailed", "get">>;
    workouts: Promise<APIResponse<"/api/workout/personal/simple", "get">>;
  };

  const [isNewWindowOpen, setIsNewWindowOpen] = useState<boolean>(false);

  const toggleNewWorkoutWindow = () => {
    setIsNewWindowOpen((prev) => !prev);
  };

  return (
    <>
      <CreateRoutine
        isNewWindowOpen={isNewWindowOpen}
        setIsNewWindowOpen={setIsNewWindowOpen}
      />
      <WorkoutsContainer
        workouts={[]}
        toggleNewWorkoutWindow={toggleNewWorkoutWindow}
      />
    </>
  );
}
