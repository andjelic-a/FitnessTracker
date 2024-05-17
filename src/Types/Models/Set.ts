export default class Set {
  id: string;
  repRange_Bottom: number;
  repRange_Top: number;
  toFailure: boolean;
  dropSet: boolean;
  exercise: number;
  creator: string;

  constructor(
    id: string,
    repRange_Bottom: number,
    repRange_Top: number,
    toFailure: boolean,
    dropSet: boolean,
    exercise: number,
    creator: string
  ) {
    this.id = id;
    this.repRange_Bottom = repRange_Bottom;
    this.repRange_Top = repRange_Top;
    this.toFailure = toFailure;
    this.dropSet = dropSet;
    this.exercise = exercise;
    this.creator = creator;
  }
}
