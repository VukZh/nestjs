import { useForm } from '@mantine/form';
import {
  type SignInType,
  type SignUpType,
} from '../../../backend/src/models/types.ts';
import { Button, Divider, Group, TextInput } from '@mantine/core';
import { PORT } from '../App.tsx';

export const Auth = () => {
  const signInForm = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
  });
  const signUpForm = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '', password2: '' },
  });

  const handleSignIn = async (values: SignInType) => {
    const resp = await fetch(`http://localhost:${PORT}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    console.log(await resp.json());
  };

  const handleSignUp = async (values: SignUpType) => {
    const resp = await fetch(`http://localhost:${PORT}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });
    console.log(await resp.json());
  };

  return (
    <>
      <form
        onSubmit={signInForm.onSubmit((values) =>
          handleSignIn(values as SignInType),
        )}
      >
        <TextInput
          withAsterisk
          label="Email"
          placeholder="email"
          type="email"
          key={signInForm.key('email')}
          {...signInForm.getInputProps('email')}
        />
        <TextInput
          withAsterisk
          label="Password"
          placeholder="password"
          type="password"
          key={signInForm.key('password')}
          {...signInForm.getInputProps('password')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">SignIn</Button>
        </Group>
      </form>
      <Divider label="Or" labelPosition="left"></Divider>
      <form
        onSubmit={signUpForm.onSubmit((values) =>
          handleSignUp(values as SignUpType),
        )}
      >
        <TextInput
          withAsterisk
          label="Email"
          placeholder="email"
          type="email"
          key={signUpForm.key('email')}
          {...signUpForm.getInputProps('email')}
        />
        <TextInput
          withAsterisk
          label="Password"
          placeholder="password"
          type="password"
          key={signUpForm.key('password')}
          {...signUpForm.getInputProps('password')}
        />
        <TextInput
          withAsterisk
          label="Password"
          placeholder="password"
          type="password"
          key={signUpForm.key('password2')}
          {...signUpForm.getInputProps('password2')}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            disabled={
              signUpForm.getInputProps('password2').value !==
              signUpForm.getInputProps('password').value
            }
          >
            SignUp
          </Button>
        </Group>
      </form>
    </>
  );
};
