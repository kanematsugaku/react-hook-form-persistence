import { useFormPersistSinglePage } from '../core/useFormPersistSinglePage';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

export function useFormPersistSingle<T extends FieldValues>(
  useFormReturn: UseFormReturn<T>,
  excludes: string[] = [],
) {
  const ROOT_KEY = 'RFHP_SINGLE';
  return useFormPersistSinglePage(useFormReturn, excludes, ROOT_KEY);
}
