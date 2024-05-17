export default class Exercise {
  id: number;
  name: string;
  images: number[];
  equipments: number[];
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
    equipments: number[],
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
    this.equipments = equipments;
    this.primaryMuscleGroups = primaryMuscleGroups;
    this.secondaryMuscleGroups = secondaryMuscleGroups;
    this.primaryMuscles = primaryMuscles;
    this.secondaryMuscles = secondaryMuscles;
    this.aliases = aliases;
    this.notes = notes;
  }
}
