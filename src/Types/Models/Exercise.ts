import IModel from "./IModel";

export default class Exercise implements IModel {
  id: number;
  name: string;
  description: string;
  image: string;
  equipmentIds: number[];
  primaryMuscleGroupIds: number[];
  secondaryMuscleGroupIds: number[];
  primaryMuscleIds: number[];
  secondaryMuscleIds: number[];
  aliasIds: number[];

  constructor(
    id: number,
    name: string,
    description: string,
    image: string,
    equipment: number[],
    primaryMuscleGroups: number[],
    secondaryMuscleGroups: number[],
    primaryMuscles: number[],
    secondaryMuscles: number[],
    aliases: number[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.equipmentIds = equipment;
    this.primaryMuscleGroupIds = primaryMuscleGroups;
    this.secondaryMuscleGroupIds = secondaryMuscleGroups;
    this.primaryMuscleIds = primaryMuscles;
    this.secondaryMuscleIds = secondaryMuscles;
    this.aliasIds = aliases;
  }
}
