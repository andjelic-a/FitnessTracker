import { useState } from "react";
import SettingsMenu from "../SettingsMenu";
import "./Privacy.scss";

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
    </div>
  );
}
