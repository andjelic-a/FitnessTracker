import { useState } from "react";
import Icon from "../../../Icon/Icon.tsx";
import "./RoutineItem.scss";

export default function RoutineItem() {
  return (
    <div className="routine-item">
      <div className="routine-item-header">
        <img src="../../../public/DefaultProfilePicture.png" alt="" />
        <p>Name of excersice</p>
      </div>
      <div className="routine-item-body">
        <ExcersiceSet />
      </div>
    </div>
  );
}

function ExcersiceSet() {
    const [set, setSet] = useState(1);

  return (
    <div className="excersice-set">
      <div className="excersice-set-placeholder">
        <p>SET</p>
        <p>KG</p>
        <p>REP RANGE</p>
      </div>
      <div className="excersice-set-item">
        <p>{set}</p>
        <p>53</p>
        <p>8-10</p>
      </div>
      <div className="excersice-set-item">dsada</div>
      <div className="excersice-set-item">dsada</div>
      <div className="excersice-set-item">dsada</div>
      <div className="icon-wrapper">
        <Icon onClick={() => setSet(prevState => prevState + 1)} className="icon" name="plus" />
      </div>
    </div>
  );
}
