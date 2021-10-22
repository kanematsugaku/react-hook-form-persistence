import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';

export function useFormPersistMulti<T>(useFormReturn: UseFormReturn<T>, includes: (keyof T)[]) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const key = 'RFHP_M';
  const inputted = watch();

  const isValid = (arg: unknown): arg is Record<string, string> => {
    const type = typeof arg;
    return type !== null && type === 'object';
  };

  // retrieve data from a storage and set them to a form
  useEffect(() => {
    const storaged = window.sessionStorage.getItem(key);
    if (storaged === null) {
      return;
    }
    const properties = JSON.parse(storaged); // eslint-disable-line
    if (isValid(properties)) {
      const extracted = includes.reduce((acc, key) => {
        // FIXME: want to remove disable/ignore
        // eslint-disable-next-line
        // @ts-ignore
        acc[key] = properties[key]; // eslint-disable-line
        return acc;
      }, {});
      Object.entries(extracted).forEach(([key, value]) => {
        // FIXME: want to remove assertions
        setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
      });
    }
    // eslint-disable-next-line
  }, [setValue]); // don't add "includes"

  // retrieve data from a form and set them to a storage
  useEffect(() => {
    const storaged = window.sessionStorage.getItem(key);
    const properties = storaged !== null ? JSON.parse(storaged) : {}; // eslint-disable-line
    const stringified = JSON.stringify({ ...properties, ...inputted });
    window.sessionStorage.setItem(key, stringified);
  }, [inputted]);

  // delete data in a storage
  const [isTriggered, setIsTriggered] = useState(false);
  useEffect(() => {
    if (isTriggered) {
      return () => window.sessionStorage.removeItem(key);
    }
  }, [isTriggered]);
  const unPersist = useCallback(() => setIsTriggered(true), []);

  // return true if all fields are filled
  const isFilled = () => {
    const values = Object.values(getValues());
    return values.length !== 0 && values.every((value) => value !== '' && value !== undefined);
  };

  // return true if all fields has no error
  const hasNoError = () => {
    return Object.keys(errors).length === 0;
  };

  // before submit: return true if isFilled, after submit: return true if isValid
  const canSubmit = () => {
    return isSubmitted ? hasNoError() : isFilled();
  };

  return {
    ...useFormReturn,
    unPersist,
    isFilled: isFilled(),
    hasNoError: hasNoError(),
    canSubmit: canSubmit(),
  };
}
