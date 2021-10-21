import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';

type Option<T> = {
  useFormKeys: (keyof T)[];
  shouldUnPersist?: boolean;
};

export function useFormPersistMultiPage<T>(useFormReturn: UseFormReturn<T>, option: Option<T>) {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useFormReturn;

  const { useFormKeys = [], shouldUnPersist = false } = option;

  const key = '_RFHPM_';
  const inputted = watch();

  const isValid = (arg: unknown): arg is Record<string, string> => {
    const type = typeof arg;
    return type !== null && type === 'object';
  };

  // retrieve data from a storage and set them to a form
  useEffect(() => {
    const storage = window.sessionStorage.getItem(key);
    if (storage !== null) {
      const properties = JSON.parse(storage); // eslint-disable-line
      if (isValid(properties)) {
        Object.entries(properties).forEach(([key_, value]) => {
          // FIXME: want to remove assertions
          setValue(key_ as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
        });
      }
    }
  }, [setValue]);

  // retrieve data from a form and set them to a storage
  useEffect(() => {
    const properties = JSON.stringify(inputted);
    window.sessionStorage.setItem(key, properties);
  }, [inputted]);

  // clear data in a storage
  const unPersist = useCallback(() => {
    if (shouldUnPersist === false) setIsShouldUnPersist(true);
  }, [shouldUnPersist]);

  const [isShouldUnPersist, setIsShouldUnPersist] = useState(shouldUnPersist);

  // delete data in a storage when a component is unmounted
  useEffect(() => {
    if (isShouldUnPersist) {
      return () => window.sessionStorage.removeItem(key);
    }
  }, [isShouldUnPersist]);

  // return true if all fields are filled
  const isFilled = () => {
    return useFormKeys.every((useFormKey) => {
      // FIXME: want to remove disable/ignore
      // @ts-ignore
      const value = getValues(useFormKey);
      return value !== '' && value !== undefined;
    });
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
