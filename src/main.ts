import { useFormPersistSingle } from './persistSingle';
import { useFormPersistMulti } from './persistMulti';

const useFormPersist = {
  single: useFormPersistSingle,
  multi: useFormPersistMulti,
};

export default useFormPersist;
