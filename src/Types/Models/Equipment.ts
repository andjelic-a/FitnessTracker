import IModel from "./IModel";

export default class Equipment implements IModel {
  id: number;
  name: string;
  usedInExercises: number[];

  constructor(id: number, name: string, usedInExercises: number[]) {
    this.id = id;
    this.name = name;
    this.usedInExercises = usedInExercises;
  }
}
