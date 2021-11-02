import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { isValid, isFilled, hasNoError, canSubmit } from './share';

export function useFormPersistMultiSelf<T>(
  useFormReturn: UseFormReturn<T>,
  excludes: (keyof T)[] = [],
) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const key = 'RFHP_SE';

  const inputted = watch();
  const getStorage = () => window.sessionStorage;
  const getPathname = () => window.location.pathname;

  // retrieve data from a storage and set them to a form
  useEffect(() => {
    const pathname = getPathname();
    const storage = getStorage();
    const storaged = storage.getItem(key);
    if (storaged === null) {
      return;
    }
    const parsed = JSON.parse(storaged); // eslint-disable-line
    if (isValid(parsed)) {
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
  const setPersistValue = useCallback(
    (valueObjectKey) => {
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
      const added = { [valueObjectKey]: removed };
      // merge and storage them
      const stringified = JSON.stringify({ ...existed, ...added });
      storage.setItem(key, stringified);
    },
    [excludes, inputted],
  );

  // retrieve data from a storage and return them
  const getPersistedValue = (sessionKey: string) => {
    const storage = getStorage();
    const storaged = storage.getItem(key) ?? '';
    // FIXME: want to remove assertions
    const existed = JSON.parse(storaged) as Record<string, Record<string, unknown>>;
    return existed[sessionKey];
  };

  // update data in a storage
  const updatePersistedValue = (sessionKey: string, updateObj: Record<string, unknown>) => {
    const storage = getStorage();
    const storaged = getPersistedValue(sessionKey);
    const updated = { ...storaged, ...updateObj };
    const stringified = JSON.stringify({ [sessionKey]: updated });
    storage.setItem(key, stringified);
  };

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
    setPersistValue,
    getPersistedValue,
    updatePersistedValue,
  };
}
