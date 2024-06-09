import { defer } from "react-router-dom";
import get from "../../Data/Get";
import { FullExercise } from "../../Types/Models/FullExercise";

const validSearchParams: string[] = [
  "id",
  "name",
  "primarymusclegroup",
  "secondarymusclegroup",
  "primarymuscle",
  "secondarymuscle",
  "equipment",
];

export async function getExerciseQueryString(
  urlSearchParams: URLSearchParams
): Promise<string[]> {
  const searchParams: {
    key: string;
    value: string | null;
  }[] = [];

  const keysIterator = urlSearchParams.keys();
  for await (const element of keysIterator) {
    searchParams.push({ key: element, value: urlSearchParams.get(element) });
  }

  searchParams.filter((x) => x.value && validSearchParams.includes(x.key));
  const query = searchParams.map((x) => `${x.key}=${x.value}`);
  return query;
}

export default async function exerciseLoader({ request }: any) {
  const url = new URL(request.url).searchParams;
  const query = await getExerciseQueryString(url);

  return defer({
    exercises: get<FullExercise>("FullExercise", "none", query, 10, 0),
  });
}
