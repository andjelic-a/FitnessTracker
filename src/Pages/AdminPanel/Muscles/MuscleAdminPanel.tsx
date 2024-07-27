import "./MuscleAdminPanel.scss";
import { useRef } from "react";
import InputField from "../../../Components/InputField/InputField";
import { useNavigate } from "react-router-dom";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import Icon from "../../../Components/Icon/Icon";
import useLoaderData from "../../../BetterRouter/UseLoaderData";
import adminMuscleLoader from "./MuscleAdminPanel";
import Async from "../../../Components/Async/Async";

export default function MuscleAdminPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const data = useLoaderData<typeof adminMuscleLoader>();
  const navigate = useNavigate();

  function add(type: "muscle" | "muscle-group", muscleGroupId: number) {
    if (type === "muscle") {
      sendAPIRequest("/api/muscle", {
        method: "post",
        payload: {
          muscleGroupId: muscleGroupId,
          name: inputRef.current?.value
            ? inputRef.current.value
            : "You didn't type anything",
        },
      }).then(() => void navigate(0));
    } else if (type === "muscle-group") {
      sendAPIRequest("/api/musclegroup", {
        method: "post",
        payload: {
          name: inputRef.current?.value
            ? inputRef.current.value
            : "You didn't type anything",
        },
      }).then(() => void navigate(0));
    }
  }

  function handleDelete(type: "muscle" | "muscle-group", id: number) {
    sendAPIRequest(
      type === "muscle" ? "/api/muscle/{id}" : "/api/musclegroup/{id}",
      {
        method: "delete",
        parameters: {
          id,
        },
      }
    ).then(() => void navigate(0));
  }

  return (
    <div id="muscle-admin-panel-container">
      <div>
        <h2>
          Type in the name of a muscle or muscle group you want to create and
          just press a button where you want to put it:
        </h2>
        <InputField inputRef={inputRef} />
      </div>

      <Async await={data.muscles}>
        {(muscles) => {
          if (muscles.code !== "OK") return null;

          return (
            <>
              <ul>
                {muscles.content.map((muscleGroup) => (
                  <li key={"muscle-group" + muscleGroup.id}>
                    <h1>
                      {muscleGroup.name}
                      <Icon
                        name="trash"
                        onClick={() =>
                          handleDelete("muscle-group", muscleGroup.id)
                        }
                      />
                    </h1>
                    <ul>
                      {muscleGroup.muscles.map((muscle) => (
                        <li key={"muscle" + muscle.id}>
                          {muscle.name}
                          <Icon
                            name="trash"
                            onClick={() =>
                              handleDelete("muscle-group", muscleGroup.id)
                            }
                          />
                        </li>
                      ))}
                      <button onClick={() => add("muscle", muscleGroup.id)}>
                        Add muscle to {muscleGroup.name}
                      </button>
                    </ul>
                  </li>
                ))}
              </ul>

              <br />
              <button onClick={() => add("muscle-group", 0)}>
                Add muscle group
              </button>
              <br />
            </>
          );
        }}
      </Async>
    </div>
  );
}
