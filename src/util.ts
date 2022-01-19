/** type guard */
export const isValidRecord = (arg: unknown): arg is Record<string, unknown> => {
  const type = typeof arg;
  return type !== null && type === 'object';
};

/** type guard */
export const isValidRecords = (args: unknown[]): args is Record<string, unknown>[] => {
  return args.every((arg) => {
    const type = typeof arg;
    return type !== null && type === 'object';
  });
};
