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
import { PORT } from '../App.tsx';
import { showErrorNotification, showSuccessNotification } from '../utils/notifications.tsx';

type UsersProps = {
  user?: UserType;
};

export const Users = (props: UsersProps) => {
  const { user } = props;
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
    'x-user-id': user?.id?.toString() || '',
    'x-user-role': user?.role || '',
  });

  const handleReload = async () => {
    try {
      const resp = await fetch(`http://localhost:${PORT}/users`);
      if (!resp.ok) {
        showErrorNotification('Error loading users', await resp.json());
        return;
      }
      const data = await resp.json();
      setUsers(data);
    } catch (e) {
      showErrorNotification('Error', e);
    }
  };
  const handleAdd = async (
    values: Pick<UserType, 'name' | 'email' | 'role' | 'status'>,
  ) => {
    try {
      const { name, email, role, status } = values;
      const resp = await fetch(`http://localhost:${PORT}/users`, {
        method: 'POST',
        headers: getCommonHeaders(),
        body: JSON.stringify({
          name,
          email,
          role,
          status,
        }),
      });
      if (!resp.ok) {
        showErrorNotification('Error adding user', await resp.json());
        return;
      }
      showSuccessNotification('User successfully added!');
      handleReload();
      close();
    } catch (e) {
      showErrorNotification('Error', e);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const resp = await fetch(`http://localhost:${PORT}/users/${id}`, {
        method: 'DELETE',
        headers: getCommonHeaders(),
      });
      if (!resp.ok) {
        showErrorNotification('Error deleting user', await resp.json());
        return;
      }
      showSuccessNotification('User successfully deleted!');
      handleReload();
    } catch (e) {
      showErrorNotification('Error', e);
    }
  };

  useEffect(() => {
    const getUser = async (id: string) => {
      if (!id) return;
      try {
        const resp = await fetch(`http://localhost:${PORT}/users/${id}`);
        if (!resp.ok) {
          showErrorNotification('Error loading user', await resp.json());
          return;
        }
        const data = await resp.json();
        formEdit.setValues(data);
      } catch (e) {
        showErrorNotification('Error', e);
      }
    };
    getUser(selectedUser);
  }, [selectedUser]);

  const handleUpdate = async (
    values: Pick<UserType, 'name' | 'email' | 'role' | 'status'>,
  ) => {
    try {
      const { name, email, role, status } = values;
      const resp = await fetch(
        `http://localhost:${PORT}/users/${selectedUser}`,
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
      );
      if (!resp.ok) {
        showErrorNotification('Error updating user', await resp.json());
        return;
      }
      showSuccessNotification('User successfully updated!');
      handleReload();
      closeEdit();
    } catch (e) {
      showErrorNotification('Error', e);
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
              values as Pick<UserType, 'name' | 'email' | 'role' | 'status'>,
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
