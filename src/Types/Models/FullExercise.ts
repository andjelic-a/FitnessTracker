import Alias from "./Alias";
import Equipment from "./Equipment";
import Muscle from "./Muscle";
import MuscleGroup from "./MuscleGroup";

export class FullExercise {
  id: number;
  name: string;
  description: string;
  image: string;
  equipment: Equipment[];
  primaryMuscleGroups: MuscleGroup[];
  secondaryMuscleGroups: MuscleGroup[];
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  aliases: Alias[];

  constructor(
    id: number,
    name: string,
    description: string,
    image: string,
    equipment: Equipment[],
    primaryMuscleGroups: MuscleGroup[],
    secondaryMuscleGroups: MuscleGroup[],
    primaryMuscles: Muscle[],
    secondaryMuscles: Muscle[],
    aliases: Alias[]
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
