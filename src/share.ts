import type { UseFormGetValues, FormState } from 'react-hook-form';

/** type guard */
export const isValid = (arg: unknown): arg is Record<string, unknown> => {
  const type = typeof arg;
  return type !== null && type === 'object';
};

/** return true if all fields are filled */
export const isFilled = <T>(getValues: UseFormGetValues<T>) => {
  const values = Object.values(getValues());
  return values.length !== 0 && values.every((value) => value !== '' && value !== undefined);
};

/** return true if all fields has no error */
export const hasNoError = (errors: Record<string, unknown>) => {
  return Object.keys(errors).length === 0;
};

/** before submit: return true if isFilled, after submit: return true if isValid */
export const canSubmit = <T>(
  isSubmitted: FormState<T>['isSubmitted'],
  isFilled_: ReturnType<typeof isFilled>,
  hasNoError_: ReturnType<typeof hasNoError>,
) => {
  return isSubmitted ? hasNoError_ : isFilled_;
};
