import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const validSearchParams: string[] = [
  "id",
  "name",
  "primarymusclegroup",
  "secondarymusclegroup",
  "primarymuscle",
  "secondarymuscle",
  "equipment",
];

export function getExerciseQueryString(
  urlSearchParams: URLSearchParams
): string[] {
  const searchParams: {
    key: string;
    value: string | null;
  }[] = [];

  const keysIterator = urlSearchParams.keys();
  for (const element of keysIterator) {
    searchParams.push({ key: element, value: urlSearchParams.get(element) });
  }

  searchParams.filter((x) => x.value && validSearchParams.includes(x.key));
  const query = searchParams.map((x) => `${x.key}=${x.value}`);
  return query;
}

const exerciseLoader = createLoader(({ request }) => {
  const url = new URL(request.url).searchParams;
  const query = getExerciseQueryString(url);

  return {
    exercises: sendAPIRequest("/api/exercise", {
      method: "get",
      parameters: {
        q: query.join(";"),
        offset: 0,
        limit: 10,
      },
    }),
  };
}, "/exercises");

export default exerciseLoader;
