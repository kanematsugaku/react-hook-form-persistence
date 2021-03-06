import type {
  UseFormReturn,
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
} from 'react-hook-form';
import { useEffect } from 'react';
import { useValidate } from './useValidate';
import { isValidRecord, removeProperties } from '../util';
import type { NonEmptyString } from '../types';

export function useFormPersistSinglePage<T extends FieldValues, U extends string>(
  useFormReturn: UseFormReturn<T>,
  excludes: Extract<keyof T, string>[] = [],
  ROOT_KEY: NonEmptyString<U>,
) {
  const { watch, setValue } = useFormReturn;

  const inputted = watch();
  const getStorage = () => window.sessionStorage;

  // Retrieve data from a storage and set them to a form
  useEffect(() => {
    const storaged = getStorage().getItem(ROOT_KEY);
    if (storaged === null) {
      return;
    }
    const parsed: unknown = JSON.parse(storaged);
    if (isValidRecord(parsed)) {
      Object.entries(parsed).forEach(([k, v]) => {
        // FIXME: Want to remove assertions
        setValue(k as Path<T>, v as UnpackNestedValue<PathValue<T, Path<T>>>);
      });
    }
  }, [ROOT_KEY, setValue]);

  // Retrieve data from a form and set them to a storage
  useEffect(() => {
    const removed = removeProperties(inputted, excludes);
    const stringified = JSON.stringify(removed);
    getStorage().setItem(ROOT_KEY, stringified);
  }, [ROOT_KEY, excludes, inputted]);

  // Delete data in a storage when a component is unmounted
  useEffect(() => {
    return () => {
      getStorage().removeItem(ROOT_KEY);
    };
  }, [ROOT_KEY]);

  return {
    ...useFormReturn,
    ...useValidate(useFormReturn),
  };
}
