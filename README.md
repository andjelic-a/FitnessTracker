# Fitness Tracker

## Overview

**Fitness Tracker** is a web application designed to help users create and log workouts using preset exercises managed by site administrators. Users can take advantage of shared workouts if they are marked as public, create personalized workout splits, and track their progress. The app supports progress tracking by allowing users to mark workouts as complete and input details like weight and repetitions for each set. Completed workouts contribute to a user's streak, similar to GitHub's streak feature, and are used to recommend new weights.

## Features

- **Create and Log Workouts:** Users can create personalized workouts using a set of pre-defined exercises. Public workouts can be shared and used by others.
- **Workout Splits:** Create workout splits that appear on the user's profile, indicating the workout scheduled for each day.
- **Progress Tracking:** Track progress by marking workouts as complete, logging weight and reps, and monitoring personal records.
- **Exercise Tutorials:** Access exercise descriptions, which may include tutorials or linked YouTube videos.
- **Streaks and Recommendations:** Maintain workout streaks and receive recommendations for new weights based on past performance.

## Technologies Used

- **Frontend:**
  - [React](https://reactjs.org/)
  - [SCSS](https://sass-lang.com/)
  - [TypeScript](https://www.typescriptlang.org/)

- **Backend:** 
  - The backend is developed as a separate project and hosted in a different GitHub repository.

## Installation

To set up the Fitness Tracker locally, follow these steps:

1. **Prerequisites:**
   - Ensure you have [Node.js](https://nodejs.org/) and npm installed.
   - Clone the frontend repository:

     ```bash
     git clone https://github.com/your-username/fitness-tracker.git
     cd fitness-tracker
     ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```
   
3. **Start the Development Server:**
   
   The project uses [Vite](https://vitejs.dev/) to run the development server:

   ```bash
   npm run dev

5. **Backend Setup**:
   
Refer to the backend repository for setup instructions.

## Usage:
   - Navigate to the website and sign up or log in.
   - Create workouts using the available exercises or browse public workouts.
   - Set up your workout split on your profile.
   - Log your workout progress and view your streaks.

## License:
   This project is licensed under the MIT License.

## Contributors:
This project is developed and maintained by:
   - [Andrej235](https://github.com/andrej235)
   - [andjelic-a](https://github.com/andjelic-a)
