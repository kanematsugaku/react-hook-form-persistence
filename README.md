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

### Optional Arguments

`react-hook-form-persistence` optionally takes a second argument as an object.

#### Exclude fields

If you want specific fields not to be persistent, specify them as `exclude`.

```tsx
type FormField = { name: string; email: string; password: string };
const { register, handleSubmit } = useFormPersist(useForm<FormField>(), {
  exclude: ['email', 'password'],
});
```

#### Disable data deletion when unmounting a component

By default, `react-hook-form-persistence` will delete persisted data when a component is unmounted. If you want to disable this process, specify it as `shouldUnpersist: false`.

```tsx
type FormField = { name: string; email: string; password: string };
const { register, handleSubmit } = useFormPersist(useForm<FormField>(), {
  shouldUnpersist: false,
});
```

### Optional return values

In addition to the result returned by `useForm`, useFormPersist returns some additional values.

#### `unpersist: () => void`

Call this function to delete persisted data whenever you want.

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
  const { register, handleSubmit, isFilled, hasNoError, canSubmit } = useFormPersist(
    useForm<FormField>()
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
