import "./Profile.scss";
import ProfileHeader from "../../Components/ProfileHeader/ProfileHeader";
import WorkoutsContainer from "../../Components/WorkoutsContainer/WorkoutsContainer";
import ActivityGrid from "../../Components/ActivityGrid/ActivityGrid";
import { useNavigate } from "react-router-dom";
import AnimatedOutlet from "../../Components/WindowWrapper/AnimatedOutlet";
import ProfileWorkoutsContainerSkeleton from "./Skeletons/ProfileWorkoutsContainerSkeleton";
import ProfileSkeleton from "./Skeletons/ProfileSkeleton";
import profileLoader from "./ProfileLoader";
import useLoaderData from "../../BetterRouter/UseLoaderData";
import Async from "../../Components/Async/Async";

export default function Profile() {
  const userData = useLoaderData<typeof profileLoader>();

  const navigate = useNavigate();

  const toggleRoutineDisplay = (workoutId: string) =>
    void navigate(`workout/${workoutId}`);

  const toggleNewWorkoutWindow = () => void navigate(`workout/new`);

  /*   const [followersOrFollowing, setFollowersOrFollowing] = useState<
    "followers" | "following" | null
  >(null);
 */
  /*   const followContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(followContainerRef, () => {
    if (followersOrFollowing) {
      setFollowersOrFollowing(null);
    }
  }); */

  return (
    <div className="profile">
      <AnimatedOutlet />

      <Async
        await={userData.workouts}
        skeleton={<ProfileWorkoutsContainerSkeleton />}
      >
        {(loadedWorkoutData) => {
          if (loadedWorkoutData.code !== "OK") return null;

          return (
            <WorkoutsContainer
              workouts={loadedWorkoutData.content}
              toggleNewWorkoutWindow={toggleNewWorkoutWindow}
              toggleRoutineDisplay={toggleRoutineDisplay}
            />
          );
        }}
      </Async>

      <Async await={userData.user} skeleton={<ProfileSkeleton />}>
        {(loadedUserData: Awaited<typeof userData.user>) => {
          if (loadedUserData.code !== "OK") return null;

          return (
            <div className="profile-user-container">
              {/* <FollowContainer
                userId={loadedUserData.content.id}
                ref={followContainerRef}
                followersOrFollowing={followersOrFollowing}
              /> */}

              <ProfileHeader
                username={loadedUserData.content.name}
                image={loadedUserData.content.image}
                workouts={loadedUserData.content.totalCompletedWorkouts}
                followers={loadedUserData.content.followers}
                following={loadedUserData.content.following}
                setFollowersOrFollowing={(x) => {
                  void navigate(`/me/${x}`);
                }}
              />

              <button className="profile-edit-button">Edit Profile</button>

              <div className="profile-body">
                <Async await={userData.streak} skeleton={<ProfileSkeleton />}>
                  {(loadedStreakData) => {
                    if (loadedStreakData.code !== "OK") return null;

                    return (
                      <ActivityGrid
                        userId={loadedUserData.content.id}
                        latestActivity={loadedStreakData.content}
                        joinedAt={new Date(loadedUserData.content.joinedAt)}
                      />
                    );
                  }}
                </Async>
              </div>
            </div>
          );
        }}
      </Async>
    </div>
  );
}
