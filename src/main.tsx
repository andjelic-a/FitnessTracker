import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./Components/Error/Error.tsx";
import Exercises, { exerciseLoader } from "./Pages/Exercises/Exercises.tsx";
import FullExerciseDisplay, {
  SingleExerciseLoader,
} from "./Components/ExerciseDisplay/FullExerciseDisplay.tsx";
import Profile, { profileLoader } from "./Pages/Profile/Profile.tsx";
import Login from "./Pages/Login/Login.tsx";

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
        children: [
          {
            path: ":exerciseId",
            element: <FullExerciseDisplay />,
            loader: SingleExerciseLoader,
          },
        ],
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
        loader: profileLoader,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "nutrition",
        element: <div>Nutrition</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
