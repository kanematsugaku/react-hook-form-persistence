import { useState } from 'react';
import type { UseFormGetValues, FormState, UseFormReturn, FieldValues } from 'react-hook-form';

/** Return true if all fields are filled. */
const isFilled = <T>(getValues: UseFormGetValues<T>) => {
  const values = Object.values(getValues());
  return values.length !== 0 && values.every((value) => value !== '' && value !== undefined);
};

/** Return true if all fields has no error. */
const hasNoError = (errors: Record<string, unknown>) => {
  return Object.keys(errors).length === 0;
};

/** Before submit: return true if isFilled. After submit: return true if isValid. */
const canSubmit = <T>(
  isSubmitted: FormState<T>['isSubmitted'],
  isFilled_: ReturnType<typeof isFilled>,
  hasNoError_: ReturnType<typeof hasNoError>,
) => {
  return isSubmitted ? hasNoError_ : isFilled_;
};

export const useValidate = <T extends FieldValues>(useFormReturn: UseFormReturn<T>) => {
  const {
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const [isFilled_, setIsFilled_] = useState(isFilled(getValues));
  const [hasNoError_, setHasNoError_] = useState(hasNoError(errors));
  const [canSubmit_, setCanSubmit_] = useState(canSubmit(isSubmitted, isFilled_, hasNoError_));

  return {
    isFilled: isFilled_,
    setIsFilled: setIsFilled_,
    hasNoError: hasNoError_,
    setHasNoError: setHasNoError_,
    canSubmit: canSubmit_,
    setCanSubmit: setCanSubmit_,
  };
};
