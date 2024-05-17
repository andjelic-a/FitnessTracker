import IModel, { Guid } from "./IModel";

export default class WorkoutSet implements IModel {
  id: Guid;
  targetSets: number;
  workout: Guid;
  set: Guid;

  constructor(id: Guid, targetSets: number, workout: Guid, set: Guid) {
    this.id = id;
    this.targetSets = targetSets;
    this.workout = workout;
    this.set = set;
  }
}
