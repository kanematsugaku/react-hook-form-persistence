/** Type guard */
export const isValidRecord = (arg: unknown): arg is Record<string, unknown> => {
  return arg !== null && typeof arg === 'object';
};

/** Type guard */
export const isValidRecords = (args: unknown[]): args is Record<string, unknown>[] => {
  return args.every(isValidRecord);
};

/** Try to parse to date, if fails return the original argument. */
export const tryParseDate = (arg: unknown) => {
  if (typeof arg !== 'string') {
    return arg;
  }
  const maybeDate = new Date(arg);
  const invalidDate = isNaN(maybeDate.getTime());
  return invalidDate ? arg : maybeDate;
};

/** Convert objects in array to single object. */
export const objectify = (array: Array<Record<string, unknown>>) => {
  return array.reduce((acc, val) => ({ ...acc, ...val }));
};
