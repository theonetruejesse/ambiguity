// literally just a set casting
export const uniqueIds = <T>(arr: T[] | undefined): T[] => {
  return Array.from(new Set(arr));
};

// helper type used to map the values of an object
// we use this type to generate the input type in cases where we want to support multiple id types
export type IdsTypeInput<T> = {
  ids: Array<string>;
  type: T[keyof T];
};
