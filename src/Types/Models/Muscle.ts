export default class Muscle {
  id: number;
  name: string;
  muscleGroupId: number;

  constructor(id: number, name: string, muscleGroupId: number) {
    this.id = id;
    this.name = name;
    this.muscleGroupId = muscleGroupId;
  }
}
