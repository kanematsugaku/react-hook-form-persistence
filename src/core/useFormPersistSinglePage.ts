import type {
  UseFormReturn,
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
} from 'react-hook-form';
import { useEffect } from 'react';
import { isValidRecord } from '../util';
import { validate } from '../share';
import type { NonEmptyString } from '../types';

export function useFormPersistSinglePage<T extends FieldValues, U extends string>(
  useFormReturn: UseFormReturn<T>,
  excludes: (keyof T)[] = [],
  ROOT_KEY: NonEmptyString<U>,
) {
  const { watch, setValue } = useFormReturn;

  const inputted = watch();
  const getStorage = () => window.sessionStorage;

  // Retrieve data from a storage and set them to a form
  useEffect(() => {
    const storage = getStorage();
    const storaged = storage.getItem(ROOT_KEY);
    if (storaged === null) {
      return;
    }
    const parsed: unknown = JSON.parse(storaged);
    if (isValidRecord(parsed)) {
      Object.entries(parsed).forEach(([key, value]) => {
        // FIXME: Want to remove assertions
        setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
      });
    }
  }, [ROOT_KEY, setValue]);

  // Retrieve data from a form and set them to a storage
  useEffect(() => {
    const storage = getStorage();
    const removed = excludes.reduce((acc, key) => {
      // FIXME: Want to remove disable/ignore
      // @ts-ignore
      delete acc[key];
      return acc;
    }, inputted);
    const stringified = JSON.stringify(removed);
    storage.setItem(ROOT_KEY, stringified);
  }, [ROOT_KEY, excludes, inputted]);

  // Delete data in a storage when a component is unmounted
  useEffect(() => {
    return () => {
      const storage = getStorage();
      storage.removeItem(ROOT_KEY);
    };
  }, [ROOT_KEY]);

  return {
    ...useFormReturn,
    ...validate(useFormReturn),
  };
}
