import IModel from "./IModel";

export default class Exercise implements IModel {
  id: number;
  name: string;
  description: string;
  image: string;
  equipment: number[];
  primaryMuscleGroups: number[];
  secondaryMuscleGroups: number[];
  primaryMuscles: number[];
  secondaryMuscles: number[];
  aliases: number[];

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
    this.equipment = equipment;
    this.primaryMuscleGroups = primaryMuscleGroups;
    this.secondaryMuscleGroups = secondaryMuscleGroups;
    this.primaryMuscles = primaryMuscles;
    this.secondaryMuscles = secondaryMuscles;
    this.aliases = aliases;
  }
}
