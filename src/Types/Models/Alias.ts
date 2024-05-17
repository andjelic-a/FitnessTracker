import IModel from "./IModel";

export default class Alias implements IModel {
  id: number;
  alias: string;
  exercise: number;

  constructor(id: number, alias: string, exercise: number) {
    this.id = id;
    this.alias = alias;
    this.exercise = exercise;
  }
}
