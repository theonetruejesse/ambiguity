// literally just a set casting
export const uniqueIds = <T>(arr: T[] | undefined): T[] => {
  return Array.from(new Set(arr));
};
