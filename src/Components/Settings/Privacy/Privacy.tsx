import { useEffect, useRef, useState } from "react";
import SettingsMenu from "../SettingsMenu";
import "./Privacy.scss";
import sendAPIRequest from "../../../Data/SendAPIRequest";

type PrivacyProps = {
  visible: boolean;
  setIsEditProfileOpen: (isVisible: boolean) => void;
  setIsAuthenticationOpen: (isVisible: boolean) => void;
  setIsPrivacyOpen: (isVisible: boolean) => void;
  onClose: () => void;
};

export default function Privacy({
  visible,
  onClose,
  setIsEditProfileOpen,
  setIsAuthenticationOpen,
  setIsPrivacyOpen,
}: PrivacyProps) {
  const [isFollowingDisabled, setIsFollowingDisabled] = useState(false);
  const [isCompletedWorkoutsDisabled, setIsCompletedWorkoutsDisabled] =
    useState(false);
  const [isStreakDisabled, setIsStreakDisabled] = useState(false);
  const [isCurrentSplitDisabled, setIsCurrentSplitDisabled] = useState(false);
  const [isLikedWorkoutsDisabled, setIsLikedWorkoutsDisabled] = useState(false);
  const [isFavoriteWorkoutsDisabled, setIsFavoriteWorkoutsDisabled] =
    useState(false);
  const [isLikedSplitsDisabled, setIsLikedSplitsDisabled] = useState(false);
  const [isFavoriteSplitsDisabled, setIsFavoriteSplitsDisabled] =
    useState(false);

  const loadedSettings = useRef<boolean>(false);

  useEffect(() => {
    if (loadedSettings.current) return;
    loadedSettings.current = true;

    sendAPIRequest("/api/user/me/settings", {
      method: "get",
    }).then((data) => {
      const settings = data.code === "OK" ? data.content : null;
      if (!settings) return;

      setIsFollowingDisabled(!settings.publicFollowing);
      setIsCompletedWorkoutsDisabled(!settings.publicCompletedWorkouts);
      setIsStreakDisabled(!settings.publicStreak);
      setIsCurrentSplitDisabled(!settings.publicCurrentSplit);
      setIsLikedWorkoutsDisabled(!settings.publicLikedWorkouts);
      setIsFavoriteWorkoutsDisabled(!settings.publicFavoriteWorkouts);
      setIsLikedSplitsDisabled(!settings.publicLikedSplits);
      setIsFavoriteSplitsDisabled(!settings.publicFavoriteSplits);

      return settings;
    });
  }, []);

  function handleSave() {
    sendAPIRequest("/api/user/me/settings", {
      method: "put",
      payload: {
        publicCompletedWorkouts: !isCompletedWorkoutsDisabled,
        publicStreak: !isStreakDisabled,
        publicCurrentSplit: !isCurrentSplitDisabled,
        publicLikedWorkouts: !isLikedWorkoutsDisabled,
        publicFavoriteSplits: !isFavoriteSplitsDisabled,
        publicFavoriteWorkouts: !isFavoriteWorkoutsDisabled,
        publicFollowing: !isFollowingDisabled,
        publicLikedSplits: !isLikedSplitsDisabled,
      },
    });
  }

  return (
    <div className={`privacy ${visible ? "privacy-show" : ""}`}>
      <SettingsMenu
        setIsEditProfileOpen={setIsEditProfileOpen}
        setIsAuthenticationOpen={setIsAuthenticationOpen}
        setIsPrivacyOpen={setIsPrivacyOpen}
        onClose={onClose}
      />

      <h3>Privacy</h3>

      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Following</h3>
            <div
              className={`privacy-container-status-indicator ${
                isFollowingDisabled && "status-indicator-disabled"
              }`}
            >
              {isFollowingDisabled ? "Private" : "Public"}
            </div>
          </div>
          <p>
            You have control over the visibility of your following list. You can
            choose to make it either public or private. If set to public, anyone
            who visits your profile can see the accounts you follow.If set to
            private, your following list will only be visible to you.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() => setIsFollowingDisabled(!isFollowingDisabled)}
          >
            <div
              className={`privacy-container-button-icon ${
                isFollowingDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isFollowingDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Completed Workouts</h3>
            <div
              className={`privacy-container-status-indicator ${
                isCompletedWorkoutsDisabled && "status-indicator-disabled"
              }`}
            >
              {isCompletedWorkoutsDisabled ? "Private" : "Public"}
            </div>
          </div>
          <p>
            Decide who can view your completed workouts. If public, anyone
            visiting your profile can see your progress. If private, only you
            will have access to this information. You can change this setting at
            any time, and your preference will be applied immediately.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() =>
              setIsCompletedWorkoutsDisabled(!isCompletedWorkoutsDisabled)
            }
          >
            <div
              className={`privacy-container-button-icon ${
                isCompletedWorkoutsDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isCompletedWorkoutsDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Streak Visibility</h3>
            <div
              className={`privacy-container-status-indicator ${
                isStreakDisabled && "status-indicator-disabled"
              }`}
            >
              {isStreakDisabled ? "Private" : "Public"}
            </div>
          </div>
          <p>
            Choose who can see your workout streak. If set to public, your
            streak will be visible to everyone who visits your profile. If set
            to private, only you can view your streak. You can adjust this
            setting at any time, with changes taking effect immediately.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() => setIsStreakDisabled(!isStreakDisabled)}
          >
            <div
              className={`privacy-container-button-icon ${
                isStreakDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isStreakDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Current Split</h3>
            <div
              className={`privacy-container-status-indicator ${
                isCurrentSplitDisabled && "status-indicator-disabled"
              }`}
            >
              {isCurrentSplitDisabled ? "Private" : "Public"}
            </div>
          </div>
          <p>
            Control the visibility of your current workout split. If set to
            public, anyone viewing your profile can see your active routine. If
            set to private, only you will have access to this information. You
            can update this setting at any time, with changes applied
            immediately.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() => setIsCurrentSplitDisabled(!isCurrentSplitDisabled)}
          >
            <div
              className={`privacy-container-button-icon ${
                isCurrentSplitDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isCurrentSplitDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Liked workouts</h3>
            <div
              className={`privacy-container-status-indicator ${
                isLikedWorkoutsDisabled && "status-indicator-disabled"
              }`}
            >
              {isLikedWorkoutsDisabled ? "Private" : "Public"}
            </div>
          </div>
          <p>
            Control the visibility of your current workout split. If set to
            public, anyone viewing your profile can see your active routine. If
            set to private, only you will have access to this information. You
            can update this setting at any time, with changes applied
            immediately.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() => setIsLikedWorkoutsDisabled(!isLikedWorkoutsDisabled)}
          >
            <div
              className={`privacy-container-button-icon ${
                isLikedWorkoutsDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isLikedWorkoutsDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Favorite workouts</h3>
            <div
              className={`privacy-container-status-indicator ${
                isFavoriteWorkoutsDisabled && "status-indicator-disabled"
              }`}
            >
              {isFavoriteWorkoutsDisabled ? "Private" : "Public"}
            </div>
          </div>
          <p>
            Control the visibility of your current workout split. If set to
            public, anyone viewing your profile can see your active routine. If
            set to private, only you will have access to this information. You
            can update this setting at any time, with changes applied
            immediately.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() =>
              setIsFavoriteWorkoutsDisabled(!isFavoriteWorkoutsDisabled)
            }
          >
            <div
              className={`privacy-container-button-icon ${
                isFavoriteWorkoutsDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isFavoriteWorkoutsDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Liked splits</h3>
            <div
              className={`privacy-container-status-indicator ${
                isLikedSplitsDisabled && "status-indicator-disabled"
              }`}
            >
              {isLikedSplitsDisabled ? "Private" : "Public"}
            </div>
          </div>
          <p>
            Control the visibility of your current workout split. If set to
            public, anyone viewing your profile can see your active routine. If
            set to private, only you will have access to this information. You
            can update this setting at any time, with changes applied
            immediately.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() => setIsLikedSplitsDisabled(!isLikedSplitsDisabled)}
          >
            <div
              className={`privacy-container-button-icon ${
                isLikedSplitsDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isLikedSplitsDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-container-text">
          <div className="privacy-container-text-header">
            <h3>Favorite splits</h3>
            <div
              className={`privacy-container-status-indicator ${
                isFavoriteSplitsDisabled && "status-indicator-disabled"
              }`}
            >
              {isFavoriteSplitsDisabled ? "Private" : "Public"}
            </div>
          </div>
          <p>
            Control the visibility of your current workout split. If set to
            public, anyone viewing your profile can see your active routine. If
            set to private, only you will have access to this information. You
            can update this setting at any time, with changes applied
            immediately.
          </p>
        </div>
        <div className="privacy-container-button">
          <div
            className="privacy-container-button-background"
            onClick={() =>
              setIsFavoriteSplitsDisabled(!isFavoriteSplitsDisabled)
            }
          >
            <div
              className={`privacy-container-button-icon ${
                isFavoriteSplitsDisabled ? "button-disabled" : ""
              }`}
            ></div>
            <div
              className={`privacy-container-button-tail ${
                isFavoriteSplitsDisabled ? "button-disabled" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>

      <button className="privacy-save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}