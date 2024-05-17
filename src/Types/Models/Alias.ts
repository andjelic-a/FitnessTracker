export default class Alias {
  id: number;
  alias: string;
  exercise: number;

  constructor(id: number, alias: string, exercise: number) {
    this.id = id;
    this.alias = alias;
    this.exercise = exercise;
  }
}
