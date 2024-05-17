import Exercise from "../Types/Models/Exercise";
import IModel from "../Types/Models/IModel";

const BaseAPIUrl = "http://192.168.1.100:5054/api";

Get<Exercise>("aliases");

type Include<T extends IModel> = {
  [P in keyof T as T[P] extends any[] ? P : never]: T[P];
};

type IncludeKeys<T extends IModel> = keyof Include<T>;

type Query<T extends IModel> = `${keyof Include<T>}=${string}`;

Get<Exercise>("images", "primaryMuscles=1,5,12");

export default async function Get<T extends IModel>(
  include: IncludeKeys<T> | IncludeKeys<T>[],
  q?: Query<T> | Query<T>[]
) {}
