import "./ProfileTabs.scss";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import * as portals from "react-reverse-portal";
import gsap from "gsap";
import Flip from "gsap/dist/Flip";
import CurrentSplitDisplay from "../CurrentSplitDisplay/CurrentSplitDisplay";
import Async from "../Async/Async";
import OverlayScrollbarCarousel from "../OverlayScrollbarCarousel/OverlayScrollbarCarousel";
import Icon from "../Icon/Icon";
import Dropdown from "../DropdownMenu/Dropdown";
import LazyLoadingContainer from "../LazyLoadingContainer/LazyLoadingContainer";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import SplitPreview from "../SplitPreview/SplitPreview";
import { useParams } from "react-router-dom";
gsap.registerPlugin(Flip);

type ProfileTabsProps = {
  latestActivity: Schema<"DetailedWeekOfCompletedWorkoutsResponseDTO"> | null;
  split: Schema<"DetailedUserSplitResponseDTO"> | null;
};

type Tab = "splits" | "workouts";

const ProfileTabs = memo(({ latestActivity, split }: ProfileTabsProps) => {
  const [openTab, setOpenTab] = useState<Tab>("splits");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchBarRef = useRef<HTMLInputElement>(null);
  const params = useParams();

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

  const memoizedCurrentSplitDisplay = useMemo<React.JSX.Element>(
    () => (
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
    [split, latestActivity]
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
    | "/api/workout/simple/by/{username}"
    | "/api/workout/favorite/simple/by/{username}"
    | "/api/workout/liked/simple/by/{username}"
    | "/api/split/simple/by/{username}"
    | "/api/split/favorite/simple/by/{username}"
    | "/api/split/liked/simple/by/{username}"
  >(null);

  const dropdown = useMemo(
    () => (
      <Dropdown
        values={
          openTab === "splits"
            ? ({
                Current: null,
                Created:
                  "username" in params
                    ? "/api/split/simple/by/{username}"
                    : "/api/split/personal/simple",
                Liked:
                  "username" in params
                    ? "/api/split/liked/simple/by/{username}"
                    : "/api/split/liked/simple",
                Favorites:
                  "username" in params
                    ? "/api/split/favorite/simple/by/{username}"
                    : "/api/split/favorite/simple",
              } as const)
            : ({
                Created:
                  "username" in params
                    ? "/api/workout/simple/by/{username}"
                    : "/api/workout/personal/simple",
                Liked:
                  "username" in params
                    ? "/api/workout/liked/simple/by/{username}"
                    : "/api/workout/liked/simple",
                Favorites:
                  "username" in params
                    ? "/api/workout/favorite/simple/by/{username}"
                    : "/api/workout/favorite/simple",
              } as const)
        }
        defaultValue={openTab === "splits" ? "Current" : "Created"}
        onSelectionChanged={(_x, y) => void setEndpoint(y ?? null)}
      />
    ),
    [openTab]
  );

  const containerMemo = useMemo(
    () =>
      endpoint === null ? null : (
        <OverlayScrollbarCarousel>
          <LazyLoadingContainer
            key={endpoint}
            endpoint={endpoint}
            baseAPIRequest={{
              method: "get",
              parameters: {
                limit: 10,
                offset: 0,
                nameFilter: searchTerm,
                username: "username" in params ? params.username : undefined,
              },
            }}
            onSegmentLoad={(segmentData) => (
              <>
                {segmentData.code === "OK"
                  ? segmentData.content.map((x) =>
                      openTab === "splits" ? (
                        <SplitPreview key={x.id} split={x} />
                      ) : (
                        <WorkoutPreview key={x.id} workout={x as any} />
                      )
                    )
                  : null}
              </>
            )}
            stopCondition={(response) =>
              response.code === "OK" && response.content.length < 10
            }
          />
        </OverlayScrollbarCarousel>
      ),
    [endpoint, searchTerm]
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

        <div className="filters-container">
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

            <Icon
              name="search"
              className="search-icon"
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="tabs-body">
        {!endpoint && memoizedCurrentSplitDisplay}

        {endpoint !== null && containerMemo}
      </div>
    </div>
  );
});

export default ProfileTabs;
