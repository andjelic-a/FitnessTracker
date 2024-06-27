export type ParseParameters<ParametersInfo> = ParametersInfo extends [
  infer First,
  ...infer Rest
]
  ? {
      [key in keyof First as key extends "name"
        ? First[key] extends string
          ? First[key]
          : never
        : never]: string;
    } & ParseParameters<Rest>
  : {};
