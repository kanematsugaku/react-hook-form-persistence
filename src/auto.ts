import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { isValid, isFilled, hasNoError, canSubmit } from './share';

export function useFormPersistMultiAuto<T>(
  useFormReturn: UseFormReturn<T>,
  excludes: (keyof T)[] = [],
) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const key = 'RFHP_AU';
  const inputted = watch();
  const getStorage = () => window.sessionStorage;
  const getPathname = () => window.location.pathname;

  // retrieve data from a storage and set them to a form
  useEffect(() => {
    const storage = getStorage();
    const storaged = storage.getItem(key);
    if (storaged === null) {
      return;
    }
    const parsed = JSON.parse(storaged); // eslint-disable-line
    if (isValid(parsed)) {
      const pathname = getPathname();
      const extracted = parsed[pathname];
      if (isValid(extracted)) {
        Object.entries(extracted).forEach(([key, value]) => {
          // FIXME: want to remove assertions
          setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
        });
      }
    }
  }, [setValue]);

  // retrieve data from a form and set them to a storage
  useEffect(() => {
    const storage = getStorage();
    // create an object from already storaged data
    const storaged = storage.getItem(key);
    const existed = storaged !== null ? JSON.parse(storaged) : {}; // eslint-disable-line
    // Create an object for the additional data to be storaged
    const removed = excludes.reduce((acc, key) => {
      // FIXME: want to remove disable/ignore
      // @ts-ignore
      delete acc[key];
      return acc;
    }, inputted);
    const pathname = getPathname();
    const added = { [pathname]: removed };
    // merge and storage them
    const stringified = JSON.stringify({ ...existed, ...added });
    storage.setItem(key, stringified);
  }, [excludes, inputted]);

  // delete data in a storage
  const unpersist = useCallback(() => {
    const storage = getStorage();
    storage.removeItem(key);
  }, []);

  const isFilled_ = isFilled(getValues);
  const hasNoError_ = hasNoError(errors);
  const canSubmit_ = canSubmit(isSubmitted, isFilled_, hasNoError_);

  return {
    ...useFormReturn,
    unpersist,
    isFilled: isFilled_,
    hasNoError: hasNoError_,
    canSubmit: canSubmit_,
  };
}
