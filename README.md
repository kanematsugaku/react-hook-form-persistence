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

### Exclude fields

If you want specific fields not to be persistent, specify them as the second argument.

```tsx
type FormField = { name: string; email: string; password: string };
const { register, handleSubmit } = useFormPersist(useForm<FormField>(), ['email', 'password']);
```

### Optional validation

In addition to the result returned by `useForm`, useFormPersist returns `isFilled` which is true if all fields are filled. This validation includes excluded fields in second arguments.

```tsx
const ExampleForm = () => {
  type FormField = { name: string };
  const { register, handleSubmit, isFilled } = useFormPersist(useForm<FormField>());
  const onSubmit = (data: FormField) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <button type="submit" disabled={!isFilled}>
        Submit
      </button>
    </form>
  );
};
```
