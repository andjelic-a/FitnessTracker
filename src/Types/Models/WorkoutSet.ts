export default class WorkoutSet {
  id: string;
  targetSets: number;
  workout: string;
  set: string;

  constructor(id: string, targetSets: number, workout: string, set: string) {
    this.id = id;
    this.targetSets = targetSets;
    this.workout = workout;
    this.set = set;
  }
}
