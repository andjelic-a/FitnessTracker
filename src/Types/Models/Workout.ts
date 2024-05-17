import IModel, { Guid } from "./IModel";

export default class Workout implements IModel {
  id: Guid;
  name: string;
  isPublic: boolean;
  creator: Guid;
  workoutSets: Guid[];

  constructor(
    id: Guid,
    name: string,
    isPublic: boolean,
    creator: Guid,
    workoutSets: Guid[]
  ) {
    this.id = id;
    this.name = name;
    this.isPublic = isPublic;
    this.creator = creator;
    this.workoutSets = workoutSets;
  }
}
