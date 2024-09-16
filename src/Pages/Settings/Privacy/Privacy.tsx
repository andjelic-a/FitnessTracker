import { useEffect, useRef, useState } from "react";
import "./Privacy.scss";
import sendAPIRequest from "../../../Data/SendAPIRequest";

export default function Privacy() {
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
    <div className="settings-tab privacy">
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
            {isFollowingDisabled
              ? "Only you can see who you follow and who follows you."
              : "Others can see who you follow and who follows you."}
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
            {isCompletedWorkoutsDisabled
              ? "Your completed workouts, along with your overall progress, are hidden from everyone."
              : "Your completed workouts, along with your overall progress, are visible to everyone."}
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
            {isStreakDisabled
              ? "Your activity streak is hidden from everyone."
              : "Your activity streak is visible to everyone. Other users can see how consistently you've been working out"}
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
            {isCurrentSplitDisabled
              ? "The split you are currently using is hidden from everyone."
              : "The split you are currently using is visible to everyone."}
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
            {isLikedWorkoutsDisabled
              ? "Your liked workouts are hidden from everyone."
              : "Your liked workouts are visible to everyone. Share the workouts you find motivating and effective."}
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
            {isFavoriteWorkoutsDisabled
              ? "Your favorite workouts are hidden from everyone."
              : "Your favorite workouts are visible to everyone. Showcase your top workout routines to inspire others."}
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
            {isLikedSplitsDisabled
              ? "Your liked splits are hidden from everyone."
              : "Your liked splits are visible to everyone. Share the splits you find effective and easy to follow."}
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
            {isFavoriteSplitsDisabled
              ? "Your favorite splits are hidden from everyone."
              : "Your favorite splits are visible to everyone. Showcase the splits that you found to work best for you."}
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
