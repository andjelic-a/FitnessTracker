import React, { useEffect, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import "./ProfileWorkoutTabs.scss";
import * as portals from "react-reverse-portal";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import WorkoutTab from "./WorkoutTab";
import CurrentSplitDisplay from "../CurrentSplitDisplay/CurrentSplitDisplay";
import Async from "../Async/Async";
import WorkoutCarousel from "../WorkoutCarousel/WorkoutCarousel";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
gsap.registerPlugin(Flip);

type ProfileWorkoutTabsProps = {
  latestActivity: Promise<Schema<"DetailedWeekOfCompletedWorkoutsResponseDTO">>;
  initialCreatedWorkouts: Promise<Schema<"SimpleWorkoutResponseDTO">[]>;
  split: Promise<Schema<"DetailedUserSplitResponseDTO"> | null>;
};

type Tab = "split" | "created" | "favorite" | "liked";

export default function ProfileWorkoutTabs({
  initialCreatedWorkouts,
  latestActivity,
  split,
}: ProfileWorkoutTabsProps) {
  const navigate = useNavigate();
  const [openTab, setOpenTab] = useState<Tab>("split");

  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const activeIndicatorPortalNode = useMemo(
    () =>
      portals.createHtmlPortalNode({
        attributes: {
          class: "active-indicator",
          "data-flip-id": "active-indicator",
        },
      }),
    []
  );

  const tabPortalNodes = useMemo<{
    [key in Tab]: portals.HtmlPortalNode;
  }>(
    () => ({
      split: portals.createHtmlPortalNode(),
      created: portals.createHtmlPortalNode(),
      favorite: portals.createHtmlPortalNode(),
      liked: portals.createHtmlPortalNode(),
    }),
    []
  );

  const memoizedTabs = useMemo<{
    [key in Tab]: React.JSX.Element;
  }>(
    () => ({
      split: (
        <Async await={Promise.all([latestActivity, split])}>
          {([activity, split]) => {
            return split ? (
              <CurrentSplitDisplay latestActivity={activity} split={split} />
            ) : (
              <WorkoutCarousel>
                <div className="empty">
                  <p>No split currently in use</p>
                  <p>
                    Press
                    <button onClick={() => console.log("Select split")}>
                      here
                    </button>
                    to select one
                  </p>
                </div>
              </WorkoutCarousel>
            );
          }}
        </Async>
      ),
      created: (
        <WorkoutTab initialWorkouts={initialCreatedWorkouts}>
          <button
            className="new-workout-btn"
            onClick={() => void navigate("workout/new")}
          >
            <p aria-hidden={false} className="accessibility-only">
              Create a new workout
            </p>

            <Icon aria-hidden={true} name="plus" />
          </button>
        </WorkoutTab>
      ),
      favorite: <WorkoutTab initialWorkouts={Promise.resolve([])} />,
      liked: <WorkoutTab initialWorkouts={Promise.resolve([])} />,
    }),
    []
  );

  useEffect(() => {
    if (!flipStateRef.current) return;

    Flip.from(flipStateRef.current, {
      scale: true,
      duration: 0.25,
      ease: "sine.inOut",
    });
  }, [openTab]);

  function handleOpenTab(tab: Tab) {
    flipStateRef.current = Flip.getState(".active-indicator");
    setOpenTab(tab);
  }

  return (
    <div className="profile-workout-tabs-container">
      <portals.InPortal node={tabPortalNodes.split}>
        {memoizedTabs.split}
      </portals.InPortal>

      <portals.InPortal node={tabPortalNodes.created}>
        {memoizedTabs.created}
      </portals.InPortal>

      <portals.InPortal node={tabPortalNodes.favorite}>
        {memoizedTabs.favorite}
      </portals.InPortal>

      <portals.InPortal node={tabPortalNodes.liked}>
        {memoizedTabs.liked}
      </portals.InPortal>

      <div className="tabs-header">
        <div className="tab">
          <button onClick={() => handleOpenTab("split")}>Split</button>
          {openTab === "split" && (
            <portals.OutPortal node={activeIndicatorPortalNode} />
          )}
        </div>

        <div className="tab">
          <button onClick={() => handleOpenTab("created")}>Created</button>
          {openTab === "created" && (
            <portals.OutPortal node={activeIndicatorPortalNode} />
          )}
        </div>

        <div className="tab">
          <button onClick={() => handleOpenTab("favorite")}>Favorite</button>

          {openTab === "favorite" && (
            <portals.OutPortal node={activeIndicatorPortalNode} />
          )}
        </div>

        <div className="tab">
          <button onClick={() => handleOpenTab("liked")}>Liked</button>

          {openTab === "liked" && (
            <portals.OutPortal node={activeIndicatorPortalNode} />
          )}
        </div>
      </div>

      <div className="tabs-body">
        <portals.OutPortal node={tabPortalNodes[openTab]} />
      </div>
    </div>
  );
}
