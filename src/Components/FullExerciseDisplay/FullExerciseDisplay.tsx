import "./FullExerciseDisplay.scss";
import FormattedText from "../FormattedText/FormattedText";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import singleExerciseLoader from "./SingleExerciseLoader";
import Async from "../Async/Async";
import Icon from "../Icon/Icon";

export default function FullExerciseDisplay() {
  const data = useLoaderData<typeof singleExerciseLoader>();

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
                <div className="full-exercise-display-header-tab">
                  <p>Summary</p>
                </div>
                <div className="full-exercise-display-header-tab">
                  <p>History</p>
                </div>
                <div className="full-exercise-display-header-tab">
                  <p>Description</p>
                </div>
              </div>
            </div>
            <div className="full-exercise-display-image">
              <img src={exercise.content.image ?? ""} alt="" />
            </div>
            <div className="info">
              <h1>{exercise.content.name}</h1>
              <FormattedText children={exercise.content.description} />

              <h2>Primary Muscles</h2>
              <ul>
                {exercise.content.primaryMuscleGroups.map((muscleGroup) => (
                  <li key={muscleGroup.id}>
                    <h3>{muscleGroup.name}</h3>
                    {exercise.content.primaryMuscles
                      .filter(
                        (muscle) => muscle.muscleGroupId === muscleGroup.id
                      )
                      .map((muscle) => (
                        <p key={muscle.id}>{muscle.name}</p>
                      ))}
                  </li>
                ))}
              </ul>

              {exercise.content.secondaryMuscleGroups.length > 0 && (
                <>
                  <h2>Secondary Muscles</h2>
                  <ul>
                    {exercise.content.secondaryMuscleGroups.map(
                      (muscleGroup) => (
                        <li key={muscleGroup.id}>
                          <h3>{muscleGroup.name}</h3>
                          {exercise.content.secondaryMuscles
                            .filter(
                              (muscle) =>
                                muscle.muscleGroupId === muscleGroup.id
                            )
                            .map((muscle) => (
                              <p key={muscle.id}>{muscle.name}</p>
                            ))}
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}

              <h2>Equipment</h2>
              <ul>
                {exercise.content.equipment.map((equipment) => (
                  <li key={equipment.id}>{equipment.name}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    </Async>
  );
}
