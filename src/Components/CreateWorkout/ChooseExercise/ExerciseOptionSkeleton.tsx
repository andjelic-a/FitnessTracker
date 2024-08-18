import "./ChooseExercise.scss";
import Icon from "../../Icon/Icon";
import { v4 } from "uuid";
import { useMemo } from "react";

export default function ExerciseOptionSkeleton() {
  const color = useMemo(() => Math.random() * 200, []);

  return (
    <div className="exercise-option" style={{ filter: "blur(4px)" }}>
      <div className="select-circle-container">
        <div></div>
      </div>
      <div className="image-container">
        <div
          style={{
            backgroundColor: `rgba(${color}, ${color}, ${color}, 1)`,
            width: "100%",
            height: "100%",
          }}
        ></div>
      </div>
      <h3>{v4().slice(0, Math.random() * 15 + 5)}</h3>
      <div className="choose-exercise-link-container">
        <Icon name="link" />
      </div>
    </div>
  );
}
