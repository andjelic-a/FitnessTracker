import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  defer,
} from "react-router-dom";
import Error from "./Components/Error/Error.tsx";
import Exercises from "./Pages/Exercises/Exercises.tsx";
import FullExerciseDisplay, {
  singleExerciseLoader,
} from "./Components/FullExerciseDisplay/FullExerciseDisplay.tsx";
import Profile from "./Pages/Profile/Profile.tsx";
import Authentication from "./Pages/Authentication/Authentication.tsx";
import { getCurrentUserData } from "./Data/User.ts";
import AdminPanel from "./Pages/AdminPanel/AdminPanel.tsx";
import AdminExercisePanel from "./Pages/AdminPanel/Exercises/AdminExercisePanel.tsx";
import NewExercise from "./Pages/AdminPanel/Exercises/New/NewExercise.tsx";
import { newExerciseLoader } from "./Pages/AdminPanel/Exercises/New/NewExerciseLoader.tsx";
import exerciseLoader from "./Pages/Exercises/ExerciseLoader.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <div>Home</div>,
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
        element: (
          <div>
            Workouts
            <Outlet />
          </div>
        ),
        children: [
          {
            path: ":workoutId",
            element: <div>workout</div>,
          },
        ],
      },
      {
        path: "me",
        element: <Profile />,
        loader: async () =>
          defer({
            user: getCurrentUserData(),
          }),
      },
      {
        path: "authentication",
        element: <Authentication />,
      },
      {
        path: "nutrition",
        element: <div>Nutrition</div>,
      },
      {
        path: "admin",
        element: <AdminPanel />,
        children: [
          {
            path: "exercises",
            element: <AdminExercisePanel />,
            loader: exerciseLoader,
          },
          {
            path: "exercises/new",
            element: <NewExercise />,
            loader: newExerciseLoader,
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
