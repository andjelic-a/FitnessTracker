import IModel from "./IModel";

export default class MuscleGroup implements IModel {
  id: number;
  name: string;
  muscles: number[];
  primaryInExercises: number[];
  secondaryInExercises: number[];

  constructor(
    id: number,
    name: string,
    muscles: number[],
    primaryInExercises: number[],
    secondaryInExercises: number[]
  ) {
    this.id = id;
    this.name = name;
    this.muscles = muscles;
    this.primaryInExercises = primaryInExercises;
    this.secondaryInExercises = secondaryInExercises;
  }
}
