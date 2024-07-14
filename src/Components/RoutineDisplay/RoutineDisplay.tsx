import "./RoutineDisplay.scss";
import { Suspense, useRef } from "react";
import useOutsideClick from "../../Hooks/UseOutsideClick";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import WindowWrapper from "../WindowWrapper/WindowWrapper";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

export default function RoutineDisplay() {
  const routineDisplayRef = useRef<HTMLDivElement>(null);
  const data = useLoaderData() as {
    routine: Promise<APIResponse<"/api/workout/{id}/detailed", "get">>;
  };

  const navigate = useNavigate();

  useOutsideClick(routineDisplayRef, () => navigate("/me"), "left");

  return (
    <WindowWrapper>
      <div ref={routineDisplayRef} className={`routine-display visible`}>
        <div className="routine-display-header">
          <p className="routine-display-title">Push</p>
          <button className="routine-display-edit">Edit</button>
        </div>

        <div className="routine-display-body">
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={data?.routine}>
              {(routine: Awaited<typeof data.routine>) => {
                if (!routine || routine.code !== "OK") return null;

                return (
                  <>
                    <p className="routine-display-description">
                      {routine.content.description}
                    </p>

                    {routine.content.exercises.map((x) => (
                      <p key={x.id}>{x.name}</p>
                    ))}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </WindowWrapper>
  );
}
