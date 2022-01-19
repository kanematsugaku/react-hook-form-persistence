import { useFormPersistSingle } from './functions/useFormPersistSingle';
import { useFormPersistPages } from './functions/useFormPersistPages';
import { useFormPersistNamed } from './functions/useFormPersistNamed';

export default {
  single: useFormPersistSingle,
  pages: useFormPersistPages,
  named: useFormPersistNamed,
};
