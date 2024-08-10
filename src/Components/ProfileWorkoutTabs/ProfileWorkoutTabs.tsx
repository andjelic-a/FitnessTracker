import { useEffect, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Async from "../Async/Async";
import WorkoutCarousel from "../WorkoutCarousel/WorkoutCarousel";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import "./ProfileWorkoutTabs.scss";
import * as portals from "react-reverse-portal";

import gsap from "gsap";
import Flip from "gsap/dist/Flip";
gsap.registerPlugin(Flip);

type ProfileWorkoutTabsProps = {
  initialCreatedWorkouts: Promise<Schema<"SimpleWorkoutResponseDTO">[]>;
};

type Tab = "created" | "favorite" | "liked";

export default function ProfileWorkoutTabs({
  initialCreatedWorkouts,
}: ProfileWorkoutTabsProps) {
  const [openTab, setOpenTab] = useState<Tab>("created");
  const stateRef = useRef<Flip.FlipState | null>(null);
  const portalNode = useMemo(
    () =>
      portals.createHtmlPortalNode({
        attributes: {
          class: "active-indicator",
          "data-flip-id": "active-indicator",
        },
      }),
    []
  );

  useEffect(() => {
    if (!stateRef.current) return;

    Flip.from(stateRef.current, {
      scale: true,
      duration: 0.25,
      ease: "sine.inOut",
    });
  }, [openTab]);

  function handleOpenTab(tab: Tab) {
    stateRef.current = Flip.getState(".active-indicator");
    setOpenTab(tab);
  }

  return (
    <div className="profile-workout-tabs-container">
      <div className="tabs-header">
        <div className="tab">
          <button onClick={() => handleOpenTab("created")}>Created</button>
          {openTab === "created" && <portals.OutPortal node={portalNode} />}
        </div>

        <div className="tab">
          <button onClick={() => handleOpenTab("favorite")}>Favorite</button>

          {openTab === "favorite" && <portals.OutPortal node={portalNode} />}
        </div>

        <div className="tab">
          <button onClick={() => handleOpenTab("liked")}>Liked</button>

          {openTab === "liked" && <portals.OutPortal node={portalNode} />}
        </div>
      </div>

      <div className="tabs-body">
        <WorkoutCarousel>
          <Async await={initialCreatedWorkouts}>
            {(workouts) => (
              <>
                {workouts.map((x) => (
                  <WorkoutPreview key={x.id} workout={x} />
                ))}
              </>
            )}
          </Async>
        </WorkoutCarousel>
      </div>
    </div>
  );
}
