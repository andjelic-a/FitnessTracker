import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Error from "./Components/Error/Error.tsx";
import Exercises from "./Pages/Exercises/Exercises.tsx";
import FullExerciseDisplay from "./Components/FullExerciseDisplay/FullExerciseDisplay.tsx";
import Profile from "./Pages/Profile/Profile.tsx";
import Authentication from "./Pages/Authentication/Authentication.tsx";
import AdminPanel from "./Pages/AdminPanel/AdminPanel.tsx";
import AdminExercisePanel from "./Pages/AdminPanel/Exercises/AdminExercisePanel.tsx";
import MuscleAdminPanel from "./Pages/AdminPanel/Muscles/MuscleAdminPanel.tsx";
import adminMuscleLoader from "./Pages/AdminPanel/Muscles/MuscleAdminPanel.ts";
import NewExercise from "./Pages/AdminPanel/Exercises/New/NewExercise.tsx";
import adminNewExerciseLoader from "./Pages/AdminPanel/Exercises/New/NewExerciseLoader.tsx";
import exerciseLoader from "./Pages/Exercises/ExerciseLoader.ts";
import singleExerciseLoader from "./Components/FullExerciseDisplay/SingleExerciseLoader.ts";
import UpdateExercise from "./Pages/AdminPanel/Exercises/Update/UpdateExercise.tsx";
import adminUpdateExerciseLoader from "./Pages/AdminPanel/Exercises/Update/UpdateExerciseLoader.ts";
import profileLoader from "./Pages/Profile/ProfileLoader.ts";
import authenticationLoader from "./Pages/Authentication/AuthenticationLoader.ts";
import adminExerciseLoader from "./Pages/AdminPanel/Exercises/AdminExercisesLoader.ts";
import EmailVerification from "./Pages/EmailVerification/EmailVerification.tsx";
import emailVerificationLoader from "./Pages/EmailVerification/EmailVerificationLoader.ts";
import LandingPage from "./Pages/LandingPage/LandingPage.tsx";
import ForgotPassword from "./Pages/ForgotPasswordPage/ForgotPassword.tsx";
import UserPage from "./Pages/User/User.tsx";
import userLoader from "./Pages/User/UserLoader.ts";
import RoutineDisplay from "./Components/RoutineDisplay/RoutineDisplay.tsx";
import routineDisplayLoader from "./Components/RoutineDisplay/RoutineDisplayLoader.ts";
import CreateRoutineWindow from "./Components/WorkoutsContainer/CreateRoutine/CreateRoutine.tsx";
import createRoutineLoader from "./Components/WorkoutsContainer/CreateRoutine/CreateRoutineLoader.ts";
import landingPageLoader from "./Pages/LandingPage/LandingPageLoader.ts";
import FollowContainer from "./Components/FollowContainer/FollowContainer.tsx";
import profileFollowersContainerLoader from "./Components/FollowContainer/ProfileFollowersContainerLoader.ts";
import profileFollowingContainerLoader from "./Components/FollowContainer/ProfileFollowingContainerLoader.ts";
import userPageFollowingContainerLoader from "./Components/FollowContainer/UserPageFollowingContainerLoader.ts";
import userPageFollowersContainerLoader from "./Components/FollowContainer/UserPageFollowersContainerLoader.ts";
import EquipmentAdminPanel from "./Pages/AdminPanel/Equipment/EquipmentAdminPanel.tsx";
import adminEquipmentLoader from "./Pages/AdminPanel/Equipment/EquipmentAdminPanelLoader.ts";
import Settings from "./Pages/Settings/Settings.tsx";
import EditRoutine from "./Components/WorkoutsContainer/EditRoutine/EditRoutine.tsx";
import StartedWorkout from "./Pages/StartedWorkout/StartedWorkout.tsx";
import startedWorkoutLoader from "./Pages/StartedWorkout/StartedWorkoutLoader.ts";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
        loader: landingPageLoader,
      },
      {
        path: "exercises",
        element: <Exercises />,
        loader: exerciseLoader,
      },
      {
        path: "exercises/:exerciseId",
        element: <FullExerciseDisplay />,
        loader: singleExerciseLoader,
      },
      {
        path: "workouts",
        element: <div>Workouts</div>,
      },
      {
        path: "workouts/:workoutId",
        element: <div>workout</div>,
      },
      {
        path: "me",
        element: <Profile />,
        loader: profileLoader,
        children: [
          {
            path: "started-workout",
            element: <StartedWorkout />,
            loader: startedWorkoutLoader,
          },
          {
            path: "workout/:id",
            element: <RoutineDisplay />,
            loader: routineDisplayLoader,
          },
          {
            path: "workout/:id/edit",
            element: <EditRoutine />,
            loader: routineDisplayLoader,
          },
          {
            path: "workout/new",
            element: <CreateRoutineWindow />,
            loader: createRoutineLoader,
          },
          {
            path: "followers",
            element: <FollowContainer followersOrFollowing="followers" />,
            loader: profileFollowersContainerLoader,
          },
          {
            path: "following",
            element: <FollowContainer followersOrFollowing="following" />,
            loader: profileFollowingContainerLoader,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
      {
        path: "authentication",
        element: <Authentication />,
        loader: authenticationLoader,
      },
      {
        path: "nutrition",
        element: <div>Nutrition</div>,
      },
      {
        path: "user/:userId",
        element: <UserPage />,
        loader: userLoader,
        children: [
          {
            path: "followers",
            element: <FollowContainer followersOrFollowing="followers" />,
            loader: userPageFollowersContainerLoader,
          },
          {
            path: "following",
            element: <FollowContainer followersOrFollowing="following" />,
            loader: userPageFollowingContainerLoader,
          },
        ],
      },
      {
        path: "email-verification/:code",
        element: <EmailVerification />,
        loader: emailVerificationLoader,
      },
      {
        path: "reset-password/:code",
        element: <ForgotPassword />,
      },
      {
        path: "admin",
        children: [
          {
            path: "",
            element: <AdminPanel />,
          },
          {
            path: "exercises",
            element: <AdminExercisePanel />,
            loader: adminExerciseLoader,
          },
          {
            path: "exercises/new",
            element: <NewExercise />,
            loader: adminNewExerciseLoader,
          },
          {
            path: "exercises/:exerciseId",
            element: <UpdateExercise />,
            loader: adminUpdateExerciseLoader,
          },
          {
            path: "muscles",
            element: <MuscleAdminPanel />,
            loader: adminMuscleLoader,
          },
          {
            path: "equipment",
            element: <EquipmentAdminPanel />,
            loader: adminEquipmentLoader,
          },
        ],
      },
    ],
  },
];

export type RouteObjects = typeof routes;

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
