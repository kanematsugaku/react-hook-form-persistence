import type { UseFormReturn, Path, PathValue, UnpackNestedValue } from 'react-hook-form';
import { useEffect } from 'react';

// eslint-disable-next-line
export const useFormPersist = <T>(useFormReturn: UseFormReturn<T>, excludeKeys?: (keyof T)[]) => {
  const { watch, setValue } = useFormReturn;

  const key = '_RFHP_';
  const storage = window.sessionStorage;
  const inputted = watch();

  const isvalid = (arg: unknown): arg is Record<string, string> => {
    const type = typeof arg;
    return type !== null && type === 'object';
  };

  // retrieve data from storage and set them to form
  useEffect(() => {
    const storaged = storage.getItem(key);
    if (storaged !== null) {
      const properties = JSON.parse(storaged); // eslint-disable-line
      if (isvalid(properties)) {
        Object.entries(properties).forEach(([key, value]) => {
          // FIXME: want to remove assertions
          setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
        });
      }
    }
  }, [setValue, storage]);

  // retrieve data from form and set them to storage
  useEffect(() => {
    excludeKeys?.forEach((key) => {
      // FIXME: want to remove disable/ignore
      // eslint-disable-next-line
      // @ts-ignore
      delete inputted[key];
    });
    const properties = JSON.stringify(inputted);
    storage.setItem(key, properties);
  }, [watch, storage, inputted, excludeKeys]);

  // delete data in storage when component is unmounted
  useEffect(() => {
    return () => {
      storage.removeItem(key);
    };
  }, [storage]);

  return useFormReturn;
};
