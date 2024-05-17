export default class User {
  id: string;
  name: string;
  email: string;
  weights: number[];
  createdWorkouts: number[];
  createdExerciseSets: number[];
  bookmarks: number[];

  constructor(
    id: string,
    name: string,
    email: string,
    weights: number[],
    createdWorkouts: number[],
    createdExerciseSets: number[],
    bookmarks: number[]
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.weights = weights;
    this.createdWorkouts = createdWorkouts;
    this.createdExerciseSets = createdExerciseSets;
    this.bookmarks = bookmarks;
  }
}
