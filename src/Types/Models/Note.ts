import IModel from "./IModel";

export default class Note implements IModel {
  id: number;
  note: string;
  exercise: number;

  constructor(id: number, note: string, exercise: number) {
    this.id = id;
    this.note = note;
    this.exercise = exercise;
  }
}
