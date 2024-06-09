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

export default async function exerciseLoader({ request }: any) {
  const url = new URL(request.url);

  const searchParams: {
    key: string;
    value: string | null;
  }[] = [];

  const keysIterator = url.searchParams.keys();
  for await (const element of keysIterator) {
    console.log(element);
    console.log(url.searchParams.get(element));
    searchParams.push({ key: element, value: url.searchParams.get(element) });
  }

  searchParams.filter((x) => x.value && validSearchParams.includes(x.key));

  return defer({
    exercises: get<FullExercise>(
      "FullExercise",
      "none",
      searchParams.map((x) => `${x.key}=${x.value}`),
      10,
      0
    ),
  });
}
