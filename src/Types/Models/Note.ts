export default class Note {
  id: number;
  note: string;
  exercise: number;

  constructor(id: number, note: string, exercise: number) {
    this.id = id;
    this.note = note;
    this.exercise = exercise;
  }
}
