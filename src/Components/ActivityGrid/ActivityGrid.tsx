import Icon from "../Icon/Icon";
import "./ActivityGrid.scss";

function ActivityGrid() {
    const activityIcons:JSX.Element[] = [];
    for(let i = 0; i < 53; i++) {
        activityIcons.push(<Icon name="dumbbell" className="activity-icon" key={i}/>);
    }

  return(
  <div className="activity-grid">
    {activityIcons}
  </div>
  );
}

export default ActivityGrid;
