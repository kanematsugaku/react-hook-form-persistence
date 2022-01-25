import { useFormPersistMultiplePages } from '../core/useFormPersistMultiplePages';
import type { UseFormReturn, FieldValues } from 'react-hook-form';
import type { NonEmptyString } from '../types';

export function useFormPersistNamed<T extends FieldValues, U extends string>(
  name: NonEmptyString<U>,
  useFormReturn: UseFormReturn<T>,
  excludes: string[] = [],
) {
  const ROOT_KEY = 'RFHP_NAMED';
  return useFormPersistMultiplePages(useFormReturn, excludes, ROOT_KEY, name);
}
