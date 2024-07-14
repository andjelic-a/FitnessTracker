import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./Components/Error/Error.tsx";
import Exercises from "./Pages/Exercises/Exercises.tsx";
import FullExerciseDisplay from "./Components/FullExerciseDisplay/FullExerciseDisplay.tsx";
import Profile from "./Pages/Profile/Profile.tsx";
import Authentication from "./Pages/Authentication/Authentication.tsx";
import AdminPanel from "./Pages/AdminPanel/AdminPanel.tsx";
import AdminExercisePanel from "./Pages/AdminPanel/Exercises/AdminExercisePanel.tsx";
import MuscleAdminPanel from "./Pages/AdminPanel/Muscles/MuscleAdminPanel.tsx";
import muscleAdminPanelLoader from "./Pages/AdminPanel/Muscles/MuscleAdminPanel.ts";
import NewExercise from "./Pages/AdminPanel/Exercises/New/NewExercise.tsx";
import { newExerciseLoader } from "./Pages/AdminPanel/Exercises/New/NewExerciseLoader.tsx";
import exerciseLoader from "./Pages/Exercises/ExerciseLoader.ts";
import singleExerciseLoader from "./Components/FullExerciseDisplay/SingleExerciseLoader.ts";
import UpdateExercise from "./Pages/AdminPanel/Exercises/Update/UpdateExercise.tsx";
import updateExerciseLoader from "./Pages/AdminPanel/Exercises/Update/UpdateExerciseLoader.ts";
import profileLoader from "./Pages/Profile/ProfileLoader.ts";
import authenticationLoader from "./Pages/Authentication/AuthenticationLoader.ts";
import allExercisesLoader from "./Pages/AdminPanel/Exercises/AllExercisesLoader.ts";
import EmailVerification from "./Pages/EmailVerification/EmailVerification.tsx";
import emailVerificationLoader from "./Pages/EmailVerification/EmailVerificationLoader.ts";
import LandingPage from "./Pages/LandingPage/LandingPage.tsx";
import landingPageLoader from "./Pages/LandingPage/LandingPageLoader.ts";
import ForgotPassword from "./Pages/ForgotPasswordPage/ForgotPassword.tsx";
import User from "./Pages/User/User.tsx";
import userLoader from "./Pages/User/UserLoader.ts";
import RoutineDisplay from "./Components/RoutineDisplay/RoutineDisplay.tsx";

const router = createBrowserRouter([
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
            path: ".",
            element: <></>,
          },
          {
            path: "workout/:id",
            element: <RoutineDisplay />,
            loader: () => {
              console.log("hello");
              return null;
            },
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
        element: <User />,
        loader: userLoader,
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
            loader: allExercisesLoader,
          },
          {
            path: "exercises/new",
            element: <NewExercise />,
            loader: newExerciseLoader,
          },
          {
            path: "exercises/:exerciseId",
            element: <UpdateExercise />,
            loader: updateExerciseLoader,
          },
          {
            path: "muscles",
            element: <MuscleAdminPanel />,
            loader: muscleAdminPanelLoader,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
