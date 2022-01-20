import type {
  UseFormReturn,
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
} from 'react-hook-form';
import { useEffect, useCallback, useMemo } from 'react';
import { isValidRecord, isValidRecords, objectify, tryParseDate } from '../util';
import { validate } from '../share';
import type { NonEmptyString } from '../types';

export function useFormPersistMultiplePages<T extends FieldValues, U extends string>(
  useFormReturn: UseFormReturn<T>,
  excludes: (keyof T)[] = [],
  ROOT_KEY: string,
  dataKey?: NonEmptyString<U>,
) {
  const { watch, setValue } = useFormReturn;

  const inputted = watch();
  const getStorage = () => window.sessionStorage;
  const getPathname = () => window.location.pathname;
  const emptyObject: Record<string, never> = useMemo(() => ({}), []);

  // Retrieve data from a storage and set them to a form
  useEffect(() => {
    const storaged = getStorage().getItem(ROOT_KEY);
    if (storaged === null) {
      return;
    }
    const parsed: unknown = JSON.parse(storaged);
    if (isValidRecord(parsed)) {
      const key = dataKey || getPathname();
      const extracted = parsed[key];
      if (isValidRecord(extracted)) {
        Object.entries(extracted).forEach(([key, value]) => {
          // FIXME: Want to remove assertions
          setValue(key as Path<T>, value as UnpackNestedValue<PathValue<T, Path<T>>>);
        });
      }
    }
  }, [ROOT_KEY, dataKey, setValue]);

  // Retrieve data from a form and set them to a storage
  useEffect(() => {
    // Create an object from already storaged data
    const storage = getStorage();
    const storaged = storage.getItem(ROOT_KEY);
    const existed: unknown = storaged === null ? emptyObject : JSON.parse(storaged);
    if (isValidRecord(existed)) {
      // Create an object for the additional data to be storaged
      const removed = excludes.reduce((acc, key) => {
        // FIXME: want to remove ts-ignore
        // @ts-ignore
        delete acc[key];
        return acc;
      }, inputted);
      const key = dataKey || getPathname();
      const added = { [key]: removed };
      // Merge and storage them
      const stringified = JSON.stringify({ ...existed, ...added });
      storage.setItem(ROOT_KEY, stringified);
    }
  }, [ROOT_KEY, dataKey, emptyObject, excludes, inputted]);

  // Delete data in a storage
  const unpersist = useCallback(() => {
    getStorage().removeItem(ROOT_KEY);
  }, [ROOT_KEY]);

  // Retrieve all data from a storage and return them as an object
  const getPersisted = useCallback(<V extends FieldValues>() => {
    const storaged = getStorage().getItem(ROOT_KEY);
    if (storaged === null) {
      return emptyObject;
    }
    const parsed: unknown = JSON.parse(storaged);
    if (isValidRecord(parsed)) {
      const extracted = Object.values(parsed);
      if (isValidRecords(extracted)) {
        const obj = objectify(extracted);
        // Convert the value to Date if possible.
        const datefied = Object.entries(obj).reduce((acc, [k, v]) => {
          return { ...acc, [k]: tryParseDate(v) };
        }, {} as Record<string, unknown>);
        return datefied as V;
      }
    }
    return emptyObject;
  }, [ROOT_KEY, emptyObject]);

  return {
    ...useFormReturn,
    unpersist,
    getPersisted,
    ...validate(useFormReturn),
  };
}
