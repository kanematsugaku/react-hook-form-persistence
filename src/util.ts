/** Type guard */
export const isValidRecord = (arg: unknown): arg is Record<string, unknown> => {
  return arg !== null && typeof arg === 'object';
};

/** Type guard */
export const isValidRecords = (args: unknown[]): args is Record<string, unknown>[] => {
  return args.every(isValidRecord);
};

/** Remove properties with the specified key from the object. */
export const removeProperties = (object: Record<string, unknown>, keys: string[]) => {
  return keys.reduce((acc, key) => {
    delete acc[key];
    return acc;
  }, object);
};

/** Convert objects in array to a single object. */
export const objectify = (array: Array<Record<string, unknown>>) => {
  return array.reduce((acc, val) => ({ ...acc, ...val }));
};
