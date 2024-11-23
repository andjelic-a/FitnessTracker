import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Modal from "react-modal";
import Error from "./Components/Error/Error.tsx";
import Exercises from "./Pages/Exercises/Exercises.tsx";
import FullExerciseDisplay from "./Components/FullExerciseDisplay/FullExerciseDisplay.tsx";
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
import authenticationLoader from "./Pages/Authentication/AuthenticationLoader.ts";
import adminExerciseLoader from "./Pages/AdminPanel/Exercises/AdminExercisesLoader.ts";
import EmailVerification from "./Pages/EmailVerification/EmailVerification.tsx";
import emailVerificationLoader from "./Pages/EmailVerification/EmailVerificationLoader.ts";
import LandingPage from "./Pages/LandingPage/LandingPage.tsx";
import ForgotPassword from "./Pages/ForgotPasswordPage/ForgotPassword.tsx";
import UserPage from "./Pages/User/UserPage.tsx";
import userLoader from "./Pages/User/UserLoader.ts";
import WorkoutDisplay from "./Components/WorkoutDisplay/WorkoutDisplay.tsx";
import workoutDisplayLoader from "./Components/WorkoutDisplay/WorkoutDisplayLoader.ts";
import landingPageLoader from "./Pages/LandingPage/LandingPageLoader.ts";
import EquipmentAdminPanel from "./Pages/AdminPanel/Equipment/EquipmentAdminPanel.tsx";
import adminEquipmentLoader from "./Pages/AdminPanel/Equipment/EquipmentAdminPanelLoader.ts";
import Settings from "./Pages/Settings/Settings.tsx";
import StartedWorkout from "./Pages/StartedWorkout/StartedWorkout.tsx";
import startedWorkoutLoader from "./Pages/StartedWorkout/StartedWorkoutLoader.ts";
import WorkoutEditor from "./Components/WorkoutEditor/WorkoutEditor.tsx";
import SplitDisplay from "./Components/SplitDisplay/SplitDisplay.tsx";
import splitDisplayLoader from "./Components/SplitDisplay/SplitDisplayLoader.ts";
import SplitCreator from "./Components/SplitCreator/SplitCreator.tsx";
import WorkoutCreator from "./Components/WorkoutCreator/WorkoutCreator.tsx";
import appLoader from "./AppLoader.ts";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    loader: appLoader,
    errorElement: <Error />,
    shouldRevalidate: () => {
      const revalidate = sessionStorage.getItem("revalidate-main");
      if (revalidate === "true") {
        sessionStorage.removeItem("revalidate-main");
        return true;
      }

      return false;
    },
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
        path: "exercises/:id",
        element: <FullExerciseDisplay />,
        loader: singleExerciseLoader,
      },
      {
        path: "started-workout",
        element: <StartedWorkout />,
        loader: startedWorkoutLoader,
      },
      {
        path: "authentication",
        element: <Authentication />,
        loader: authenticationLoader,
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
      {
        path: ":username",
        element: <UserPage />,
        loader: userLoader,
        shouldRevalidate: ({ currentParams, nextParams }) => {
          const revalidate = sessionStorage.getItem("revalidate-profile");
          if (revalidate === "true") {
            sessionStorage.removeItem("revalidate-profile");
            return true;
          }

          return (
            currentParams.username !== undefined &&
            nextParams.username !== undefined &&
            currentParams.username !== nextParams.username
          );
        },
        children: [
          {
            path: "workout/new",
            element: <WorkoutCreator />,
          },
          {
            path: "workout/:name",
            element: <WorkoutDisplay />,
            loader: workoutDisplayLoader,
          },
          {
            path: "workout/:name/edit",
            element: <WorkoutEditor />,
            loader: workoutDisplayLoader,
          },
          {
            path: "split/new",
            element: <SplitCreator />,
          },
          {
            path: "split/:name",
            element: <SplitDisplay />,
            loader: splitDisplayLoader,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
];

export type RouteObjects = typeof routes;

const router = createBrowserRouter(routes);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

Modal.setAppElement("#root");
