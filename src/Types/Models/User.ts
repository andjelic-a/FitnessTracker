import IModel, { Guid } from "./IModel";

export default class User implements IModel {
  id: Guid;
  name: string;
  email: string;
  weights: Guid[];
  createdWorkouts: Guid[];
  createdExerciseSets: Guid[];
  bookmarks: number[];

  constructor(
    id: Guid,
    name: string,
    email: string,
    weights: Guid[],
    createdWorkouts: Guid[],
    createdExerciseSets: Guid[],
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
