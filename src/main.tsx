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
import NewExercise from "./Pages/AdminPanel/Exercises/New/NewExercise.tsx";
import { newExerciseLoader } from "./Pages/AdminPanel/Exercises/New/NewExerciseLoader.tsx";
import exerciseLoader from "./Pages/Exercises/ExerciseLoader.ts";
import singleExerciseLoader from "./Components/FullExerciseDisplay/SingleExerciseLoader.ts";
import UpdateExercise from "./Pages/AdminPanel/Exercises/Update/UpdateExercise.tsx";
import updateExerciseLoader from "./Pages/AdminPanel/Exercises/Update/UpdateExerciseLoader.ts";
import FormattedText from "./Components/FormattedText/FormattedText.tsx";
import profileLoader from "./Pages/Profile/ProfileLoader.ts";
import authenticationLoader from "./Pages/Authentication/AuthenticationLoader.ts";
import allExercisesLoader from "./Pages/AdminPanel/Exercises/AllExercisesLoader.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: (
          <FormattedText>{`asd [My link](@e 8)\n !i(https://imminenceswe.com/cdn/shop/files/imm-dig-final-01.jpg?v=1708269484&width=1500 123 500*500)\n !v(SvggTtqySH8)`}</FormattedText>
        ),
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
