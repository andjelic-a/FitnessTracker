export default class PersonalExerciseWeight {
  weight: number;
  isCurrent: boolean;
  dateOfAchieving: Date;
  exercise: number;
  userId: string;

  constructor(
    weight: number,
    isCurrent: boolean,
    dateOfAchieving: Date,
    exercise: number,
    userId: string
  ) {
    this.weight = weight;
    this.isCurrent = isCurrent;
    this.dateOfAchieving = dateOfAchieving;
    this.exercise = exercise;
    this.userId = userId;
  }
}
