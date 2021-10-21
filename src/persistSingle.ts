import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect, useCallback } from 'react';

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

  const key = '_RFHPS_';
  const inputted = watch();

  const isValid = (arg: unknown): arg is Record<string, string> => {
    const type = typeof arg;
    return type !== null && type === 'object';
  };

  const excludeProperties = useCallback(<K>(properties: K, keys: (keyof T)[] = []) => {
    keys.forEach((key) => {
      // FIXME: want to remove disable/ignore
      // eslint-disable-next-line
      // @ts-ignore
      delete properties[key];
    });
    return properties;
  }, []);

  // retrieve data from a storage and set them to a form
  useEffect(() => {
    const storaged = window.sessionStorage.getItem(key);
    if (storaged !== null) {
      const properties = JSON.parse(storaged); // eslint-disable-line
      if (isValid(properties)) {
        Object.entries(properties).forEach(([key, value]) => {
          // FIXME: want to remove assertions
          setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
        });
      }
    }
  }, [setValue]);

  // retrieve data from a form and set them to a storage
  useEffect(() => {
    const excluded = excludeProperties(inputted, excludes);
    const properties = JSON.stringify(excluded);
    window.sessionStorage.setItem(key, properties);
  }, [excludes, inputted, excludeProperties]);

  // delete data in a storage when a component is unmounted
  useEffect(() => {
    return () => {
      window.sessionStorage.removeItem(key);
    };
  }, []);

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
    isFilled: isFilled(),
    hasNoError: hasNoError(),
    canSubmit: canSubmit(),
  };
}
