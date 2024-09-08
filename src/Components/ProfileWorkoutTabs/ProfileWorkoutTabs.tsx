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
import FavoriteWorkoutsTab from "./FavoriteWorkoutsTab";
import LikedWorkoutsTab from "./LikedWorkoutsTab";
import Icon from "../Icon/Icon";
import { useNavigate } from "react-router-dom";
gsap.registerPlugin(Flip);

type ProfileWorkoutTabsProps = {
  latestActivity: Promise<Schema<"DetailedWeekOfCompletedWorkoutsResponseDTO">>;
  split: Promise<Schema<"DetailedUserSplitResponseDTO"> | null>;
};

type Tab = "split" | "created" | "favorite" | "liked";

export default function ProfileWorkoutTabs({
  latestActivity,
  split,
}: ProfileWorkoutTabsProps) {
  const [openTab, setOpenTab] = useState<Tab>("split");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchBarRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const searchBarPortalNode = useMemo(
    () =>
      portals.createHtmlPortalNode({
        attributes: {
          class: "search-bar-container",
        },
      }),
    []
  );

  const startWorkoutBtnPortalNode = useMemo(
    () =>
      portals.createHtmlPortalNode({
        attributes: {
          class: "change-split-btn-container",
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
                </div>
              </WorkoutCarousel>
            );
          }}
        </Async>
      ),
      created: <CreatedWorkoutsTab searchTerm={searchTerm} />,
      favorite: <FavoriteWorkoutsTab searchTerm={searchTerm} />,
      liked: <LikedWorkoutsTab searchTerm={searchTerm} />,
    }),
    [searchTerm]
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
      <portals.InPortal node={tabPortalNodes.split}>
        {memoizedTabs.split}
      </portals.InPortal>

      <portals.InPortal node={tabPortalNodes.created}>
        <WorkoutCarousel>{memoizedTabs.created}</WorkoutCarousel>
      </portals.InPortal>

      <portals.InPortal node={tabPortalNodes.favorite}>
        <WorkoutCarousel>{memoizedTabs.favorite}</WorkoutCarousel>
      </portals.InPortal>

      <portals.InPortal node={tabPortalNodes.liked}>
        <WorkoutCarousel>{memoizedTabs.liked}</WorkoutCarousel>
      </portals.InPortal>

      <portals.InPortal node={searchBarPortalNode}>
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
      </portals.InPortal>

      <portals.InPortal node={startWorkoutBtnPortalNode}>
        <Async await={split}>
          {(split) => (
            <>
              {split &&
                split.workouts.findIndex(
                  (x) => x.day === new Date().getUTCDay()
                ) !== -1 && (
                  <button onClick={() => navigate("started-workout")}>
                    Start today's workout
                  </button>
                )}
            </>
          )}
        </Async>
      </portals.InPortal>

      <div className="tabs-header">
        <div className="tabs">
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

        {openTab === "split" ? (
          <portals.OutPortal node={startWorkoutBtnPortalNode} />
        ) : (
          <portals.OutPortal node={searchBarPortalNode} />
        )}
      </div>

      <div className="tabs-body">
        <portals.OutPortal node={tabPortalNodes[openTab]} />
      </div>
    </div>
  );
}
