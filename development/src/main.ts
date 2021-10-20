import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect, useCallback } from 'react';

export default function useFormPersist<T>(
  useFormReturn: UseFormReturn<T>,
  excludeKeys?: (keyof T)[],
) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const key = '_RFHP_';
  const inputted = watch();

  const isvalid = (arg: unknown): arg is Record<string, string> => {
    const type = typeof arg;
    return type !== null && type === 'object';
  };

  // retrieve data from a storage and set them to a form
  useEffect(() => {
    const storaged = window.sessionStorage.getItem(key);
    if (storaged !== null) {
      const properties = JSON.parse(storaged); // eslint-disable-line
      if (isvalid(properties)) {
        Object.entries(properties).forEach(([key, value]) => {
          // FIXME: want to remove assertions
          setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
        });
      }
    }
  }, [setValue]);

  // retrieve data from a form and set them to a storage
  useEffect(() => {
    excludeKeys?.forEach((key) => {
      // FIXME: want to remove disable/ignore
      // eslint-disable-next-line
      // @ts-ignore
      delete inputted[key];
    });
    const properties = JSON.stringify(inputted);
    window.sessionStorage.setItem(key, properties);
  }, [watch, inputted, excludeKeys]);

  // delete data in a storage when a component is unmounted
  useEffect(() => {
    return () => {
      window.sessionStorage.removeItem(key);
    };
  }, []);

  // return true if all fields are filled
  const isFilled = useCallback(() => {
    const values = Object.values(getValues());
    return values.length !== 0 && values.every((value) => value !== '' && value !== undefined);
  }, [getValues]);

  // return true if all fields has no error
  const hasNoError = useCallback(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // before submit: return true if isFilled, after submit: return true if isValid
  const canSubmit = useCallback(() => {
    return isSubmitted ? hasNoError() : isFilled();
  }, [isSubmitted, hasNoError, isFilled]);

  return {
    ...useFormReturn,
    isFilled: isFilled(),
    hasNoError: hasNoError(),
    canSubmit: canSubmit(),
  };
}
