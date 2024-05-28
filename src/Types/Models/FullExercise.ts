import Alias from "./Alias";
import Equipment from "./Equipment";
import Image from "./Image";
import Muscle from "./Muscle";
import MuscleGroup from "./MuscleGroup";
import Note from "./Note";

export class FullExercise {
  id: number;
  name: string;
  images: Image[];
  equipment: Equipment[];
  primaryMuscleGroups: MuscleGroup[];
  secondaryMuscleGroups: MuscleGroup[];
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  aliases: Alias[];
  notes: Note[];

  constructor(
    id: number,
    name: string,
    images: Image[],
    equipment: Equipment[],
    primaryMuscleGroups: MuscleGroup[],
    secondaryMuscleGroups: MuscleGroup[],
    primaryMuscles: Muscle[],
    secondaryMuscles: Muscle[],
    aliases: Alias[],
    notes: Note[]
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
