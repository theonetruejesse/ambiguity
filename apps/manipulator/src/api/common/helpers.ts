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

export function wrapSubscription<T>(
  generator: AsyncGenerator<T>,
  name: string
): AsyncGenerator<T> {
  return {
    ...generator,
    async next(...args) {
      try {
        return await generator.next(...args);
      } catch (error) {
        console.error(`[${name}] Generator next() error:`, {
          error,
          stack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  } as AsyncGenerator<T>;
}
