import "./MuscleAdminPanel.scss";
import { Suspense, useRef } from "react";
import InputField from "../../../Components/InputField/InputField";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { APIResponse } from "../../../Types/Endpoints/ResponseParser";
import sendAPIRequest from "../../../Data/SendAPIRequest";

export default function MuscleAdminPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const data = useLoaderData() as {
    muscles: Promise<APIResponse<"/api/musclegroup/detailed", "get">>;
  };
  const navigate = useNavigate();

  function add(type: "muscle" | "muscle-group", muscleGroupId: number) {
    if (type === "muscle") {
      sendAPIRequest("/api/muscle", {
        method: "post",
        payload: {
          muscleGroupId: muscleGroupId,
          name: inputRef.current?.value ?? "You didn't type anything",
        },
      });
    } else if (type === "muscle-group") {
      sendAPIRequest("/api/musclegroup", {
        method: "post",
        payload: {
          name: inputRef.current?.value ?? "You didn't type anything",
        },
      });
    }
    navigate(0);
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

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.muscles}>
          {(muscles: Awaited<typeof data.muscles>) => {
            if (muscles.code !== "OK") return null;

            return (
              <>
                <ul>
                  {muscles.content.map((muscleGroup) => (
                    <li key={"muscle-group" + muscleGroup.id}>
                      <h1>{muscleGroup.name}</h1>
                      <ul>
                        {muscleGroup.muscles.map((muscle) => (
                          <li key={"muscle" + muscle.id}>{muscle.name}</li>
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
        </Await>
      </Suspense>
    </div>
  );
}
