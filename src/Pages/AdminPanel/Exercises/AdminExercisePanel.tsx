import { useNavigate } from "react-router-dom";
import useLoaderData from "../../../BetterRouter/UseLoaderData";
import adminExerciseLoader from "./AdminExercisesLoader";
import Async from "../../../Components/Async/Async";

export default function AdminExercisePanel() {
  const data = useLoaderData<typeof adminExerciseLoader>();
  const navigate = useNavigate();

  return (
    <Async await={data.exercises}>
      {(exercises) => {
        if (exercises.code !== "OK") return null;

        return (
          <div className="exercises-admin-panel-container">
            {exercises.content.map((exercise) => {
              return (
                <div
                  className="exercise-card"
                  key={exercise.id}
                  onClick={() => navigate(`${exercise.id}`)}
                >
                  <p>{exercise.name}</p>
                </div>
              );
            })}

            <button onClick={() => navigate("new")}>Add Exercise</button>
          </div>
        );
      }}
    </Async>
  );
}
