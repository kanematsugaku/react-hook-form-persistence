import { useForm } from 'react-hook-form';
import useFormPersist from './main';

export default function App() {
  type FormField = { persisted1: string; persisted2: string; unpersisted: string };
  const { register, handleSubmit, canSubmit, unpersist } = useFormPersist(useForm<FormField>(), {
    exclude: ['unpersisted'],
  });

  const onSubmit = (data: FormField) => console.log(data);
  const reload = () => window.location.reload();
  const clear = () => {
    unpersist();
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
