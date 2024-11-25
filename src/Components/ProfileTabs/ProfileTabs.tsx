import "./ProfileTabs.scss";
import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import MiniPreview from "../MiniPreview/MiniPreview";
import { Link, useParams } from "react-router-dom";
import basicProfileInfoContext from "../../Contexts/BasicProfileInfoContext";
gsap.registerPlugin(Flip);

type ProfileTabsProps = {
  latestActivity: Schema<"DetailedWeekOfCompletedWorkoutsResponseDTO"> | null;
  split: Schema<"DetailedUserSplitResponseDTO"> | null;
  isMe: boolean;
  privacySettings: Schema<"UserSettingsResponseDTO">;
};

type Tab = "split" | "workout";

const ProfileTabs = memo(
  ({ latestActivity, split, isMe, privacySettings }: ProfileTabsProps) => {
    const [openTab, setOpenTab] = useState<Tab>("split");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const searchBarRef = useRef<HTMLInputElement>(null);
    const params = useParams();
    const basicInfo = useContext(basicProfileInfoContext);

    const flipStateRef = useRef<Flip.FlipState | null>(null);

    const showWorkoutTab = useMemo(
      () =>
        isMe ||
        privacySettings.publicCreatedWorkouts ||
        privacySettings.publicLikedWorkouts ||
        privacySettings.publicFavoriteWorkouts,
      [privacySettings]
    );

    const showSplitTab = useMemo(
      () =>
        isMe ||
        privacySettings.publicCurrentSplit ||
        privacySettings.publicCreatedSplits ||
        privacySettings.publicLikedSplits ||
        privacySettings.publicFavoriteSplits,
      [privacySettings]
    );

    useEffect(() => {
      setOpenTab(isMe ? "split" : showSplitTab ? "split" : "workout");
    }, [isMe, showSplitTab]);

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
      | "/api/workout/simple/by/{username}"
      | "/api/workout/favorite/simple/by/{username}"
      | "/api/workout/liked/simple/by/{username}"
      | "/api/split/simple/by/{username}"
      | "/api/split/favorite/simple/by/{username}"
      | "/api/split/liked/simple/by/{username}"
    >(null);

    const dropdown = useMemo(() => {
      let values =
        openTab === "split"
          ? ({
              Current: null,
              Created: "/api/split/simple/by/{username}",
              Liked: "/api/split/liked/simple/by/{username}",
              Favorites: "/api/split/favorite/simple/by/{username}",
            } as const)
          : ({
              Created: "/api/workout/simple/by/{username}",
              Liked: "/api/workout/liked/simple/by/{username}",
              Favorites: "/api/workout/favorite/simple/by/{username}",
            } as const);

      if (!isMe) {
        if (openTab === "split" && !privacySettings.publicCurrentSplit)
          delete (values as any)["Current"];

        if (
          (openTab === "split" && !privacySettings.publicCreatedSplits) ||
          (openTab === "workout" && !privacySettings.publicCreatedWorkouts)
        )
          delete (values as any)["Created"];

        if (
          (openTab === "split" && !privacySettings.publicLikedSplits) ||
          (openTab === "workout" && !privacySettings.publicLikedWorkouts)
        )
          delete (values as any)["Liked"];

        if (
          (openTab === "split" && !privacySettings.publicFavoriteSplits) ||
          (openTab === "workout" && !privacySettings.publicFavoriteWorkouts)
        )
          delete (values as any)["Favorites"];
      }

      return (
        <Dropdown
          className="tabs-header-dropdown"
          values={values}
          onSelectionChanged={(_x, y) => {
            setEndpoint(y ?? null);
          }}
        />
      );
    }, [openTab]);

    const containerMemo = useMemo(() => {
      if (endpoint === null) return null;
      const ableToCreateWorkouts =
        basicInfo == null || !basicInfo.isVerified || !isMe
          ? undefined
          : endpoint === "/api/workout/simple/by/{username}";

      const ableToCreateSplits =
        basicInfo == null || !basicInfo.isVerified || !isMe
          ? undefined
          : endpoint === "/api/split/simple/by/{username}";

      return (
        <OverlayScrollbarCarousel>
          <LazyLoadingContainer
            key={endpoint}
            endpoint={endpoint}
            baseAPIRequest={{
              method: "get",
              parameters: {
                limit: 10,
                offset: 0,
                nameFilter: searchTerm.length > 0 ? searchTerm : undefined,
                username: params.username!,
              },
            }}
            onSegmentLoad={(segmentData, i) => (
              <>
                {i === 0 &&
                  (segmentData.code !== "OK" ||
                    segmentData.content.length === 0) &&
                  !ableToCreateSplits &&
                  !ableToCreateWorkouts && (
                    <div className="empty">
                      <p>Nothing to see here...</p>
                    </div>
                  )}

                {segmentData.code === "OK" &&
                  segmentData.content.map((x) => (
                    <MiniPreview key={x.id} data={x} type={openTab} />
                  ))}
              </>
            )}
            stopCondition={(response) =>
              response.code === "Forbidden" ||
              (response.code === "OK" && response.content.length < 10)
            }
            before={
              <>
                {ableToCreateSplits && (
                  <Link className="add-button" to="split/new">
                    +
                  </Link>
                )}

                {ableToCreateWorkouts && (
                  <Link className="add-button" to="workout/new">
                    +
                  </Link>
                )}
              </>
            }
          />
        </OverlayScrollbarCarousel>
      );
    }, [endpoint, searchTerm]);

    return !showSplitTab && !showWorkoutTab ? null : (
      <div className="profile-workout-tabs-container">
        <div className="tabs-header">
          <div className="tabs">
            {showSplitTab && (
              <div className="tab">
                <button onClick={() => handleOpenTab("split")}>Split</button>
                {openTab === "split" && (
                  <portals.OutPortal node={activeIndicatorPortalNode} />
                )}
              </div>
            )}

            {showWorkoutTab && (
              <div className="tab">
                <button onClick={() => handleOpenTab("workout")}>
                  Workouts
                </button>
                {openTab === "workout" && (
                  <portals.OutPortal node={activeIndicatorPortalNode} />
                )}
              </div>
            )}
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
  }
);

export default ProfileTabs;
