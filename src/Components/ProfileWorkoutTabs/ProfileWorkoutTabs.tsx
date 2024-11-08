import "./ProfileWorkoutTabs.scss";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import * as portals from "react-reverse-portal";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import CurrentSplitDisplay from "../CurrentSplitDisplay/CurrentSplitDisplay";
import Async from "../Async/Async";
import OverlayScrollbarCarousel from "../OverlayScrollbarCarousel/OverlayScrollbarCarousel";
import CreatedWorkoutsTab from "./CreatedWorkoutsTab";
import Icon from "../Icon/Icon";
import Dropdown from "../DropdownMenu/Dropdown";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import SplitPreview from "../SplitPreview/SplitPreview";
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
              <OverlayScrollbarCarousel>
                <div className="empty">
                  <p>No split currently in use</p>
                </div>
              </OverlayScrollbarCarousel>
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

  const [endpoint, setEndpoint] = useState<
    | null
    | "/api/workout/personal/simple"
    | "/api/workout/liked/simple"
    | "/api/workout/favorite/simple"
    | "/api/split/personal/simple"
    | "/api/split/liked/simple"
    | "/api/split/favorite/simple"
  >(null);

  const dropdown = useMemo(
    () => (
      <Dropdown
        values={
          openTab === "splits"
            ? ({
                Current: null,
                Created: "/api/split/personal/simple",
                Liked: "/api/split/liked/simple",
                Favorites: "/api/split/favorite/simple",
              } as const)
            : ({
                Created: "/api/workout/personal/simple",
                Liked: "/api/workout/liked/simple",
                Favorites: "/api/workout/favorite/simple",
              } as const)
        }
        defaultValue={openTab === "splits" ? "Current" : "Created"}
        onSelectionChanged={(_x, y) => setEndpoint(y ?? null)}
      />
    ),
    [openTab]
  );

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

        {dropdown}

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
        {openTab === "splits" &&
          (endpoint === null ? (
            memoizedTabs.splits
          ) : (
            <OverlayScrollbarCarousel>
              <LazyLoadingContainer
                key={endpoint}
                endpoint={endpoint}
                baseAPIRequest={{
                  method: "get",
                  parameters: {
                    limit: 10,
                    offset: 0,
                  },
                }}
                onSegmentLoad={(segmentData) => {
                  if (
                    segmentData.code !== "OK" ||
                    segmentData.content.length === 0
                  )
                    return <p className="empty">Nothing to see here...</p>;

                  return (
                    <>
                      {segmentData.content.map((x) => (
                        <SplitPreview key={x.id} split={x as any} />
                      ))}
                    </>
                  );
                }}
                stopCondition={(response) =>
                  response.code === "Unauthorized" ||
                  (response.code === "OK" && response.content.length < 10)
                }
              />
            </OverlayScrollbarCarousel>
          ))}

        {openTab === "workouts" && endpoint && (
          <OverlayScrollbarCarousel>
            <LazyLoadingContainer
              key={endpoint}
              endpoint={endpoint}
              baseAPIRequest={{
                method: "get",
                parameters: {
                  limit: 10,
                  offset: 0,
                },
              }}
              onSegmentLoad={(segmentData) => {
                if (
                  segmentData.code !== "OK" ||
                  segmentData.content.length === 0
                )
                  return <p className="empty">Nothing to see here...</p>;

                return (
                  <>
                    {segmentData.content.map((x) => (
                      <WorkoutPreview key={x.id} workout={x as any} />
                    ))}
                  </>
                );
              }}
              stopCondition={(response) =>
                response.code === "Unauthorized" ||
                (response.code === "OK" && response.content.length < 10)
              }
            />
          </OverlayScrollbarCarousel>
        )}
      </div>
    </div>
  );
}
