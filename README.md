# `react-hook-form-persistence`

A very simple library for persisting react-hook-form.

## Installation

```sh
npm install react-hook-form-persistence
```

## Usage

`react-hook-form-persistence` has three methods. `single`, `pages` and `named`.

- `single`: is appropriate in the following cases:
  - If you want to make data persistent on only one page.
- `pages`: is appropriate in the following cases:
  - If you want to make data persistent across multiple pages.
- `named`: is appropriate in the following cases:
  - If you want to make data persistent across multiple pages, and want to update the same data field on multiple pages.

Each method have almost all the same interface.

The differences between them are discussed later, but in general, they are used as follows.

**Just wrap a result of `useForm` which React Hook Form returns.**

_(In the following example, `single` is used.)_

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

If you want specific fields not to be persistent, specify them as the the next argument of the result of `useForm`.

```tsx
type FormField = { name: string; email: string; password: string };
const { register, handleSubmit } = useFormPersist.single(useForm<FormField>(), [
  'email',
  'password',
]);
```

### Return values

In addition to the result returned by `useForm`, useFormPersist returns some additional values regarding validation.

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

## Differences between each method

### `single`

`single` deletes the persisted data when the component is unmounted. So this will keep the data when the page is reloaded, and discard them when the user moves to another page.

### `pages` and `named`

Neither will automatically delete persisted data. Instead, they return additional function `unpersist` and `getPersisted`.

- `unpersist`: Call this to delete persisted data whenever you want.
- `getPersisted`: Call this to retrieve persisted data whenever you want.

```tsx
const ExampleForm = () => {
  type FormField = { name: string };
  const { register, handleSubmit, unpersist } = useFormPersist.pages(useForm<FormField>());
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

#### Difference between `pages` and `named`

When using `pages`, persisted data on one page cannot be updated on other pages. If this is inconvenient, use `named`.

In `named`, You will need to provide the key name as the first argument. You can update the same data from either page by specifying the same key name.

**`pages`**

```tsx
const { register, handleSubmit, unpersist } = useFormPersist.pages(useForm<FormField>());
```

**`named`**

```tsx
const { register, handleSubmit, unpersist } = useFormPersist.pages(
  'userData',
  useForm<FormField>(),
);
```
