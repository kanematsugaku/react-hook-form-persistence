import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { isValidRecord, isValidRecords, isFilled, hasNoError, canSubmit } from './share';

export function useFormPersistMulti<T>(
  useFormReturn: UseFormReturn<T>,
  excludes: (keyof T)[] = [],
) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const key = 'RFHP_M';
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
    const parsed: unknown = JSON.parse(storaged);
    if (isValidRecord(parsed)) {
      const pathname = getPathname();
      const extracted = parsed[pathname];
      if (isValidRecord(extracted)) {
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
  const unPersist = useCallback(() => {
    const storage = getStorage();
    storage.removeItem(key);
  }, []);

  // retrieve all data from a storage and return them as an object
  const getPersisted = useCallback(() => {
    const storaged = getStorage().getItem(key);
    if (storaged === null) {
      return;
    }
    const parsed: unknown = JSON.parse(storaged);
    if (isValidRecord(parsed)) {
      const values = Object.values(parsed);
      if (isValidRecords(values)) {
        const persisted = values.reduce((acc, obj) => {
          return { ...acc, ...obj };
        });
        return persisted;
      }
    }
  }, []);

  const isFilled_ = isFilled(getValues);
  const hasNoError_ = hasNoError(errors);
  const canSubmit_ = canSubmit(isSubmitted, isFilled_, hasNoError_);

  return {
    ...useFormReturn,
    unPersist,
    getPersisted,
    isFilled: isFilled_,
    hasNoError: hasNoError_,
    canSubmit: canSubmit_,
  };
}
