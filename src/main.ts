import { useFormPersistSingle } from './single';
import { useFormPersistMultiAuto } from './auto';
import { useFormPersistMultiSelf } from './self';

const useFormPersist = {
  single: useFormPersistSingle,
  auto: useFormPersistMultiAuto,
  self: useFormPersistMultiSelf,
};

export default useFormPersist;
