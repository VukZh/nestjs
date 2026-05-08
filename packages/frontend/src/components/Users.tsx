import {
  ActionIcon,
  Button,
  Flex,
  Input,
  Modal,
  Table,
  Text,
  TextInput,
  Group,
  Select,
} from '@mantine/core';
import {
  TbReload,
  TbCategoryPlus,
  TbCategoryMinus,
  TbCategory,
} from 'react-icons/tb';
import { useEffect, useState } from 'react';
import { type UserType } from '../../../backend/src/models/types.ts';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../utils/notifications.tsx';
import { fetchWithAuth } from '../utils/fetchWithAuth.ts';
import { useCookies } from 'react-cookie';
import { API_URL } from '../config.ts';

export const Users = () => {
  const [cookies] = useCookies(['token']);
  const [selectedUser, setSelectedUser] = useDebouncedState('', 500);
  const [users, setUsers] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      password: '',
    },
  });
  const formEdit = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      role: '',
      status: '',
    },
  });

  const getCommonHeaders = () => ({
    'Content-Type': 'application/json',
  });

  const handleReload = async () => {
    try {
      const resp = await fetchWithAuth(
        `${API_URL}/users`,
        {},
        cookies.token,
      );
      if (!resp.ok) {
        showErrorNotification('Error loading users', await resp.json());
        return;
      }
      const data = await resp.json();
      setUsers(data);
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };
  const handleAdd = async (
    values: Pick<UserType, 'name' | 'email' | 'role' | 'status' | 'password'>,
  ) => {
    try {
      const { name, email, role, status, password } = values;
      const resp = await fetchWithAuth(
        `${API_URL}/users`,
        {
          method: 'POST',
          headers: getCommonHeaders(),
          body: JSON.stringify({
            name,
            email,
            role,
            status,
            password,
          }),
        },
        cookies.token,
      );
      if (!resp.ok) {
        showErrorNotification('Error adding user', await resp.json());
        return;
      }
      showSuccessNotification('User successfully added!');
      handleReload();
      close();
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const resp = await fetchWithAuth(
        `${API_URL}/users/${id}`,
        {
          method: 'DELETE',
          headers: getCommonHeaders(),
        },
        cookies.token,
      );
      if (!resp.ok) {
        showErrorNotification('Error deleting user', await resp.json());
        return;
      }
      showSuccessNotification('User successfully deleted!');
      handleReload();
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };

  useEffect(() => {
    const getUser = async (id: string) => {
      if (!id) return;
      try {
        const resp = await fetchWithAuth(
          `${API_URL}/users/${id}`,
          {},
          cookies.token,
        );
        if (!resp.ok) {
          showErrorNotification('Error loading user', await resp.json());
          return;
        }
        const data = await resp.json();
        formEdit.setValues(data);
      } catch (e) {
        showErrorNotification('Error', e as Error);
      }
    };
    getUser(selectedUser);
  }, [selectedUser]);

  const handleUpdate = async (
    values: Pick<UserType, 'name' | 'email' | 'role' | 'status'>,
  ) => {
    try {
      const { name, email, role, status } = values;
      const resp = await fetchWithAuth(
        `${API_URL}/users/${selectedUser}`,
        {
          method: 'PATCH',
          headers: getCommonHeaders(),
          body: JSON.stringify({
            name,
            email,
            role,
            status,
          }),
        },
        cookies.token,
      );
      if (!resp.ok) {
        showErrorNotification('Error updating user', await resp.json());
        return;
      }
      showSuccessNotification('User successfully updated!');
      handleReload();
      closeEdit();
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };

  return (
    <Flex direction="column" gap="xs">
      <Flex align="center" gap="md">
        <ActionIcon variant="filled" onClick={handleReload}>
          <TbReload style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
        <Text size="sm">Users table:</Text>
      </Flex>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>{head}</Table.Thead>
        <Table.Tbody>
          {users.length ? rows(users) : <Text size="xs">No data</Text>}
        </Table.Tbody>
      </Table>
      <ActionIcon variant="filled" color="lime" onClick={open}>
        <TbCategoryPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>

      <Flex gap="xs" align="center">
        <Input
          placeholder="Input user ID"
          onChange={(e) => setSelectedUser(e.currentTarget.value)}
        />
        <ActionIcon
          variant="filled"
          color="red"
          onClick={() => handleDelete(selectedUser)}
        >
          <TbCategoryMinus style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
        <ActionIcon variant="filled" color="orange" onClick={openEdit}>
          <TbCategory style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Flex>
      <Modal opened={opened} onClose={close} title="Add" centered>
        <form
          onSubmit={form.onSubmit((values) =>
            handleAdd(
              values as Pick<
                UserType,
                'name' | 'email' | 'role' | 'status' | 'password'
              >,
            ),
          )}
        >
          <TextInput
            withAsterisk
            label="Name"
            placeholder="name"
            key={form.key('name')}
            {...form.getInputProps('name')}
          />

          <TextInput
            withAsterisk
            label="Email"
            placeholder="email"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <Select
            withAsterisk
            label="Role"
            placeholder="Pick role"
            data={['user', 'admin', 'author']}
            key={form.key('role')}
            {...form.getInputProps('role')}
          />

          <Select
            withAsterisk
            label="Status"
            placeholder="Pick Status"
            data={['active', 'blocked']}
            key={form.key('status')}
            {...form.getInputProps('status')}
          />

          <TextInput
            withAsterisk
            label="Password"
            placeholder="password"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Modal>
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit" centered>
        <form
          onSubmit={formEdit.onSubmit((values) =>
            handleUpdate(
              values as Pick<UserType, 'name' | 'email' | 'role' | 'status'>,
            ),
          )}
        >
          <TextInput
            label="Name"
            placeholder="name"
            key={formEdit.key('name')}
            {...formEdit.getInputProps('name')}
          />

          <TextInput
            label="Email"
            placeholder="email"
            key={formEdit.key('email')}
            {...formEdit.getInputProps('email')}
          />

          <Select
            label="Role"
            placeholder="Pick role"
            data={['user', 'admin', 'author']}
            key={formEdit.key('role')}
            {...formEdit.getInputProps('role')}
          />

          <Select
            label="Status"
            placeholder="Pick Status"
            data={['active', 'blocked']}
            key={formEdit.key('status')}
            {...formEdit.getInputProps('status')}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Edit</Button>
          </Group>
        </form>
      </Modal>
    </Flex>
  );
};

const head = (
  <Table.Tr>
    <Table.Th>id</Table.Th>
    <Table.Th>name</Table.Th>
    <Table.Th>email</Table.Th>
    <Table.Th>role</Table.Th>
    <Table.Th>status</Table.Th>
  </Table.Tr>
);

const rows = (elements: UserType[]) => {
  return elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.role}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
    </Table.Tr>
  ));
};
