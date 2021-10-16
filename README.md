# `react-hook-form-persistence`

A very simple library for persisting react-hook-form.

## Installation

```sh
npm install react-hook-form-persistence
```

## Example Usage

Just wrap a result of `useForm` which React Hook Form returns.

```tsx
import { useForm } from 'react-hook-form';
import useFormPersist from 'react-hook-form-persistence';

const ExampleForm = () => {
  type FormField = { name: string; email: string; password: string };
  const { register, handleSubmit } = useFormPersist(useForm<FormField>());
  const onSubmit = (data: FormField) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <input {...register('password')} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ExampleForm;
```

## Additional Example Usage

If you want specific fields not to be persistent, specify them as the second argument.

```tsx
import { useForm } from 'react-hook-form';
import useFormPersist from 'react-hook-form-persistence';

type FormField = { name: string; email: string; password: string };
const { register, handleSubmit } = useFormPersist(useForm<FormField>(), ['email', 'password']);
```
