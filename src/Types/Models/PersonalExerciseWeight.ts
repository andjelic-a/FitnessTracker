import IModel, { Guid } from "./IModel";

export default class PersonalExerciseWeight implements IModel {
  id: Guid;
  weight: number;
  isCurrent: boolean;
  dateOfAchieving: Date;
  exercise: number;
  userId: Guid;

  constructor(
    id: Guid,
    weight: number,
    isCurrent: boolean,
    dateOfAchieving: Date,
    exercise: number,
    userId: Guid
  ) {
    this.id = id;
    this.weight = weight;
    this.isCurrent = isCurrent;
    this.dateOfAchieving = dateOfAchieving;
    this.exercise = exercise;
    this.userId = userId;
  }
}
