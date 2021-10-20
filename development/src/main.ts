import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect, useCallback } from 'react';

type Option<T> = {
  exclude?: (keyof T)[];
  shouldUnpersist?: boolean;
};

export default function useFormPersist<T>(useFormReturn: UseFormReturn<T>, option: Option<T>) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const { exclude = [], shouldUnpersist = false } = option;

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
    exclude.forEach((key) => {
      // FIXME: want to remove disable/ignore
      // eslint-disable-next-line
      // @ts-ignore
      delete inputted[key];
    });
    const properties = JSON.stringify(inputted);
    window.sessionStorage.setItem(key, properties);
  }, [watch, inputted, exclude]);

  // clear data in a storage
  const unpersist = useCallback(() => window.sessionStorage.removeItem(key), []);

  // delete data in a storage when a component is unmounted
  useEffect(() => {
    if (shouldUnpersist) {
      return unpersist();
    }
  }, [shouldUnpersist, unpersist]);

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
    unpersist,
    isFilled: isFilled(),
    hasNoError: hasNoError(),
    canSubmit: canSubmit(),
  };
}
