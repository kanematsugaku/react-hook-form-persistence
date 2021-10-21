import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';

export function useFormPersistMulti<T>(
  useFormReturn: UseFormReturn<T>,
  includes: (keyof T)[] = [],
) {
  const {
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const key = '_RFHPM_';
  const inputted = watch();

  const isValid = (arg: unknown): arg is Record<string, string> => {
    const type = typeof arg;
    return type !== null && type === 'object';
  };

  const includeProperties = useCallback(<K>(properties: K, keys: (keyof T)[] = []) => {
    const included = {};
    keys.forEach((key) => {
      // FIXME: want to remove disable/ignore
      // eslint-disable-next-line
      // @ts-ignore
      included[key] = properties[key]; // eslint-disable-line
    });
    return included;
  }, []);

  // retrieve data from a storage and set them to a form
  useEffect(() => {
    const storaged = window.sessionStorage.getItem(key);
    if (storaged !== null) {
      const properties = JSON.parse(storaged); // eslint-disable-line
      if (isValid(properties)) {
        const included = includeProperties(properties, includes);
        Object.entries(included).forEach(([key, value]) => {
          // FIXME: want to remove assertions
          setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
        });
      }
    }
  }, [includes, setValue, includeProperties]);

  // retrieve data from a form and set them to a storage
  useEffect(() => {
    const included = includeProperties(inputted, includes);
    const properties = JSON.stringify(included);
    window.sessionStorage.setItem(key, properties);
  }, [includes, inputted, includeProperties]);

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
    const included = includeProperties(inputted, includes);
    const values = Object.values(included);
    return values.length !== 0 && values.every((value) => value !== '' && value !== undefined);
  };

  // return true if all fields has no error
  const hasNoError = () => {
    const included = includeProperties(errors, includes);
    return Object.keys(included).length === 0;
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
