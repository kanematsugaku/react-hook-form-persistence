import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect } from 'react';
import { isValidRecord, isFilled, hasNoError, canSubmit } from './share';

export function useFormPersistSingle<T>(
  useFormReturn: UseFormReturn<T>,
  excludes: (keyof T)[] = [],
) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const key = 'RFHP_S';
  const inputted = watch();
  const getStorage = () => window.sessionStorage;

  // retrieve data from a storage and set them to a form
  useEffect(() => {
    const storage = getStorage();
    const storaged = storage.getItem(key);
    if (storaged === null) {
      return;
    }
    const parsed: unknown = JSON.parse(storaged);
    if (isValidRecord(parsed)) {
      Object.entries(parsed).forEach(([key, value]) => {
        // FIXME: want to remove assertions
        setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
      });
    }
  }, [setValue]);

  // retrieve data from a form and set them to a storage
  useEffect(() => {
    const storage = getStorage();
    const removed = excludes.reduce((acc, key) => {
      // FIXME: want to remove disable/ignore
      // @ts-ignore
      delete acc[key];
      return acc;
    }, inputted);
    const stringified = JSON.stringify(removed);
    storage.setItem(key, stringified);
  }, [excludes, inputted]);

  // delete data in a storage when a component is unmounted
  useEffect(() => {
    return () => {
      const storage = getStorage();
      storage.removeItem(key);
    };
  }, []);

  const isFilled_ = isFilled(getValues);
  const hasNoError_ = hasNoError(errors);
  const canSubmit_ = canSubmit(isSubmitted, isFilled_, hasNoError_);

  return {
    ...useFormReturn,
    isFilled: isFilled_,
    hasNoError: hasNoError_,
    canSubmit: canSubmit_,
  };
}
