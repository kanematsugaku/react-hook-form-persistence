# `react-hook-form-persistence`

A very simple library for persisting react-hook-form.

## Installation

```sh
npm install react-hook-form-persistence
```

## Usage

`react-hook-form-persistence` has two methods. `single` and `multi`.

- `single`: If you want to use the persisted data on only one page, use this one.
- `multi`: If you want to use persisted data across multiple pages, use this one.

## Example Usage: `single` or `multi`

`single` and `multi` have the same interface.

Just wrap a result of `useForm` which React Hook Form returns.

```tsx
import { useForm } from 'react-hook-form';
import useFormPersist from 'react-hook-form-persistence';

const ExampleForm = () => {
  type FormField = { name: string; email: string; password: string };
  const { register, handleSubmit } = useFormPersist.single(useForm<FormField>());
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

### Optional Arguments

If you want specific fields not to be persistent, specify them as the second argument.

```tsx
type FormField = { name: string; email: string; password: string };
const { register, handleSubmit } = useFormPersist.single(useForm<FormField>(), [
  'email',
  'password',
]);
```

### Optional return values

In addition to the result returned by `useForm`, useFormPersist returns some additional values.

#### `isFilled: boolean`

This value is true if all fields are filled. This validation includes excluded fields in second arguments.

#### `hasNoError: boolean`

This value is true if all fields has no error. This validation includes excluded fields in second arguments.

#### `canSubmit: boolean`

- Before submit: This value is true if `isFilled`
- After submit: This value is true if `hasNoError`

```tsx
const ExampleForm = () => {
  type FormField = { name: string };
  const { register, handleSubmit, isFilled, hasNoError, canSubmit } = useFormPersist.single(
    useForm<FormField>(),
  );
  const onSubmit = (data: FormField) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input type="submit" value="Submit if isFilled" disabled={!isFilled} />
      <input type="submit" value="Submit if hasNoError" disabled={!hasNoError} />
      <input type="submit" value="Submit if canSubmit" disabled={!canSubmit} />
    </form>
  );
};
```

## Difference between `single` and `multi`

- `single` will delete persisted data when a component is unmounted.
- `multi` will not. Instead, this return additional function `unpersist`. Call this to delete persisted data whenever you want.

```tsx
const ExampleForm = () => {
  type FormField = { name: string };
  const { register, handleSubmit, unpersist } = useFormPersist.multi(useForm<FormField>());
  const onSubmit = (data: FormField) => console.log(data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} />
        <button type="submit">Submit</button>
      </form>
      <button onClick={unpersist}>Clear persisted data</button>
    </>
  );
};
```
