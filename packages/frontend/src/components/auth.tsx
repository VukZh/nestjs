import { useForm } from '@mantine/form';
import {
  type SignInType,
  type SignUpType,
} from '../../../backend/src/models/types.ts';
import { Button, Group, TextInput, Tabs } from '@mantine/core';
import { PORT } from '../App.tsx';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../utils/notifications.tsx';

export const Auth = () => {
  const signInForm = useForm({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
  });

  const signUpForm = useForm({
    mode: 'controlled',
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
    if (!resp.ok) {
      showErrorNotification('Error signing in', await resp.json());
    } else {
      showSuccessNotification('Successfully signed in');
    }
    console.log(await resp.json());
  };

  const handleSignUp = async (values: SignUpType) => {
    console.log(values);
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
    if (!resp.ok) {
      showErrorNotification('Error signing up', await resp.json());
    } else {
      showSuccessNotification('Successfully signed up');
    }
  };

  return (
    <Tabs
      defaultValue="signin"
      style={{ marginTop: '36px', margin: '36px auto', maxWidth: '360px' }}
    >
      <Tabs.List justify="center">
        <Tabs.Tab value="signin">SignIn</Tabs.Tab>
        <Tabs.Tab value="signup">SignUp</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="signin">
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
      </Tabs.Panel>

      <Tabs.Panel value="signup">
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
            placeholder="re-enter password"
            type="password"
            key={signUpForm.key('password2')}
            {...signUpForm.getInputProps('password2')}
          />

          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              disabled={
                signUpForm.getValues().password2 !==
                signUpForm.getValues().password
              }
            >
              SignUp
            </Button>
          </Group>
        </form>
      </Tabs.Panel>
    </Tabs>
  );
};
