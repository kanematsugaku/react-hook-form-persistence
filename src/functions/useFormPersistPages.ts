import { useFormPersistMultiplePages } from '../core/useFormPersistMultiplePages';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

export function useFormPersistPages<T extends FieldValues>(
  useFormReturn: UseFormReturn<T>,
  excludes: string[] = [],
) {
  const ROOT_KEY = 'RFHP_PAGES';
  return useFormPersistMultiplePages(useFormReturn, excludes, ROOT_KEY);
}
