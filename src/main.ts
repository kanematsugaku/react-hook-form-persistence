import { useFormPersistSingle } from './functions/useFormPersistSingle';
import { useFormPersistPages } from './functions/useFormPersistPages';
import { useFormPersistNamed } from './functions/useFormPersistNamed';
import type { UseValidateReturn } from './core/useValidate';

export default {
  single: useFormPersistSingle,
  pages: useFormPersistPages,
  named: useFormPersistNamed,
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UseFormPersistence {
  export type IsFilled = UseValidateReturn['isFilled'];
  export type SetIsFilled = UseValidateReturn['setIsFilled'];
  export type HasNoError = UseValidateReturn['hasNoError'];
  export type SetHasNoError = UseValidateReturn['setHasNoError'];
  export type CanSubmit = UseValidateReturn['canSubmit'];
  export type SetCanSubmit = UseValidateReturn['setCanSubmit'];
}
