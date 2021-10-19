import { useForm } from 'react-hook-form';
import useFormPersist from './main';

export default function App() {
  type FormField = { persisted1: string; persisted2: string; unpersisted: string };
  const { register, handleSubmit, isFilled } = useFormPersist(useForm<FormField>(), [
    'unpersisted',
  ]);
  const onSubmit = (data: FormField) => console.log(data);
  const reload = () => window.location.reload();
  const clear = () => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    reload();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          Persisted1: <input {...register('persisted1')} />
        </div>
        <div>
          Persisted2: <input {...register('persisted2')} />
        </div>
        <div>
          Unpersisted: <input {...register('unpersisted')} />
        </div>
        <input type="submit" value="Submit" disabled={!isFilled} />
      </form>
      <button onClick={reload}>Reload</button>
      <button onClick={clear}>Clear Storage</button>
    </>
  );
}
