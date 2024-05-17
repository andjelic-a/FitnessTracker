import IModel, { Guid } from "./IModel";

export default class Set implements IModel {
  id: Guid;
  repRange_Bottom: number;
  repRange_Top: number;
  toFailure: boolean;
  dropSet: boolean;
  exercise: number;
  creator: Guid;

  constructor(
    id: Guid,
    repRange_Bottom: number,
    repRange_Top: number,
    toFailure: boolean,
    dropSet: boolean,
    exercise: number,
    creator: Guid
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
