import Icon from "../Icon/Icon";
import "./ActivityGrid.scss";

export default function ActivityGridSkeleton() {
  return (
    <>
      <h3 className="activity-grid-header">
        <b>0</b> workouts done in last year
      </h3>
      <div className="activity-grid">
        {Array.from({ length: 52 }).map((_, index) => (
          <div key={index} className="activity-item"></div>
        ))}
      </div>
      <div className="activity-grid-footer">
        <Icon className="caret-icon" name="caret-left" />
        <p>Latest</p>
        <Icon className="caret-icon" name="caret-right" />
      </div>
    </>
  );
}
