import "./ProfileWorkoutTabs.scss";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import * as portals from "react-reverse-portal";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import CurrentSplitDisplay from "../CurrentSplitDisplay/CurrentSplitDisplay";
import Async from "../Async/Async";
import WorkoutCarousel from "../WorkoutCarousel/WorkoutCarousel";
import CreatedWorkoutsTab from "./CreatedWorkoutsTab";
import Icon from "../Icon/Icon";
import Dropdown from "../DropdownMenu/Dropdown";
gsap.registerPlugin(Flip);

type ProfileWorkoutTabsProps = {
  latestActivity: Schema<"DetailedWeekOfCompletedWorkoutsResponseDTO"> | null;
  split: Schema<"DetailedUserSplitResponseDTO"> | null;
};

type Tab = "splits" | "workouts";

export default function ProfileWorkoutTabs({
  latestActivity,
  split,
}: ProfileWorkoutTabsProps) {
  const [openTab, setOpenTab] = useState<Tab>("splits");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchBarRef = useRef<HTMLInputElement>(null);

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

  const memoizedTabs = useMemo<{
    [key in Tab]: React.JSX.Element;
  }>(
    () => ({
      splits: (
        <Async await={Promise.all([latestActivity, split])}>
          {([activity, split]) => {
            return split ? (
              <CurrentSplitDisplay latestActivity={activity} split={split} />
            ) : (
              <WorkoutCarousel>
                <div className="empty">
                  <p>No split currently in use</p>
                </div>
              </WorkoutCarousel>
            );
          }}
        </Async>
      ),
      workouts: <CreatedWorkoutsTab searchTerm={searchTerm} />,
    }),
    [searchTerm, split, latestActivity]
  );

  function handleSearch() {
    if (!searchBarRef.current) return;
    setSearchTerm(searchBarRef.current.value.trim());
  }

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
      <div className="tabs-header">
        <div className="tabs">
          <div className="tab">
            <button onClick={() => handleOpenTab("splits")}>Split</button>
            {openTab === "splits" && (
              <portals.OutPortal node={activeIndicatorPortalNode} />
            )}
          </div>

          <div className="tab">
            <button onClick={() => handleOpenTab("workouts")}>Workouts</button>
            {openTab === "workouts" && (
              <portals.OutPortal node={activeIndicatorPortalNode} />
            )}
          </div>
        </div>

        <Dropdown
          values={{
            Value1: 1,
            Value2: 2,
            Value3: 3,
          }}
          defaultValue={"Value3"}
        />

        <div className="search-bar-container">
          <input
            name="profile-workouts-search-bar"
            type="text"
            autoComplete="off"
            className="search-bar"
            placeholder="Search"
            ref={searchBarRef}
            onKeyDown={(e) => e.key === "Enter" && void handleSearch()}
          />

          <Icon name="search" className="search-icon" onClick={handleSearch} />
        </div>
      </div>

      <div className="tabs-body">
        {openTab === "splits" && memoizedTabs.splits}
        {openTab === "workouts" && (
          <WorkoutCarousel>{memoizedTabs.workouts}</WorkoutCarousel>
        )}
      </div>
    </div>
  );
}
