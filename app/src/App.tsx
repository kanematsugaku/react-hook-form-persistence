import { useForm } from 'react-hook-form';
import useFormPersist from 'react-hook-form-persistence'; // need npm link

export default function App() {
  type FormField = { persisted1: string; persisted2: string; unpersisted: string };
  const { register, handleSubmit, canSubmit } = useFormPersist.single(useForm<FormField>(), [
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
          Persisted1: <input {...register('persisted1', { required: true })} />
        </div>
        <div>
          Persisted2: <input {...register('persisted2', { required: true, minLength: 8 })} />
        </div>
        <div>
          Unpersisted: <input {...register('unpersisted', { required: true })} />
        </div>
        <input type="submit" value="Submit" disabled={!canSubmit} />
      </form>
      <button onClick={reload}>Reload</button>
      <button onClick={clear}>Clear Storage</button>
    </>
  );
}
