export default class Workout {
  id: string;
  name: string;
  isPublic: boolean;
  creator: string;
  workoutSets: string[];

  constructor(id: string, name: string, isPublic: boolean, creator: string) {
    this.id = id;
    this.name = name;
    this.isPublic = isPublic;
    this.creator = creator;
    this.workoutSets = [];
  }
}
