import { useState, useEffect } from 'react';
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

const useValidate = <T extends FieldValues>(useFormReturn: UseFormReturn<T>) => {
  const {
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const isFilled_ = isFilled(getValues);
  const hasNoError_ = hasNoError(errors);
  const canSubmit_ = canSubmit(isSubmitted, isFilled_, hasNoError_);

  const [isFilledState, setIsFilledState] = useState(isFilled_);
  const [hasNoErrorState, setHasNoErrorState] = useState(hasNoError_);
  const [canSubmitState, setCanSubmitState] = useState(canSubmit_);

  useEffect(() => setIsFilledState(isFilled_), [isFilled_]);
  useEffect(() => setHasNoErrorState(hasNoError_), [hasNoError_]);
  useEffect(() => setCanSubmitState(canSubmit_), [canSubmit_]);

  return {
    isFilled: isFilledState,
    setIsFilled: setIsFilledState,
    hasNoError: hasNoErrorState,
    setHasNoError: setHasNoErrorState,
    canSubmit: canSubmitState,
    setCanSubmit: setCanSubmitState,
  };
};

export { useValidate };

export type UseValidateReturn = ReturnType<typeof useValidate>;
