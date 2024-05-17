import IModel from "./IModel";

export default class Exercise implements IModel {
  id: number;
  name: string;
  images: number[];
  equipment: number[];
  primaryMuscleGroups: number[];
  secondaryMuscleGroups: number[];
  primaryMuscles: number[];
  secondaryMuscles: number[];
  aliases: number[];
  notes: number[];

  constructor(
    id: number,
    name: string,
    images: number[],
    equipment: number[],
    primaryMuscleGroups: number[],
    secondaryMuscleGroups: number[],
    primaryMuscles: number[],
    secondaryMuscles: number[],
    aliases: number[],
    notes: number[]
  ) {
    this.id = id;
    this.name = name;
    this.images = images;
    this.equipment = equipment;
    this.primaryMuscleGroups = primaryMuscleGroups;
    this.secondaryMuscleGroups = secondaryMuscleGroups;
    this.primaryMuscles = primaryMuscles;
    this.secondaryMuscles = secondaryMuscles;
    this.aliases = aliases;
    this.notes = notes;
  }
}
