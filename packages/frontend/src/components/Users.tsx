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
import { type UserType } from '../../../backend/src/models/user.ts';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { PORT } from '../App.tsx';
import { notifications } from '@mantine/notifications';

export const Users = () => {
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
      role: '',
      status: '',
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
  const handleReload = async () => {
    try {
      const resp = await fetch(`http://localhost:${PORT}/users`);
      if (!resp.ok) {
        notifications.show({
          message: 'Error loading users!',
          color: 'red',
          autoClose: 5000,
        });
      }
      const data = await resp.json();
      setUsers(data);
      notifications.show({
        message: 'Users successfully loaded!',
        color: 'green',
        autoClose: 5000,
      });
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
  };
  const handleAdd = async (
    values: Pick<UserType, 'name' | 'email' | 'role' | 'status'>,
  ) => {
    try {
      const { name, email, role, status } = values;
      const resp = await fetch(`http://localhost:${PORT}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          role,
          status,
        }),
      });
      if (!resp.ok) {
        notifications.show({
          message: 'Error adding user!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'User successfully added!',
        color: 'green',
        autoClose: 5000,
      });
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
    close();
  };
  const handleDelete = async (id: string) => {
    try {
      const resp = await fetch(`http://localhost:${PORT}/users/${id}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        notifications.show({
          message: 'Error deleting user!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'User successfully deleted!',
        color: 'green',
        autoClose: 5000,
      });
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    const getUser = async (id: string) => {
      const resp = await fetch(`http://localhost:${PORT}/users/${id}`);
      const data = await resp.json();
      formEdit.setValues(data);
    };
    try {
      getUser(selectedUser);
    } catch (e) {
      console.log(e);
    }
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            role,
            status,
          }),
        },
      );
      if (!resp.ok) {
        notifications.show({
          message: 'Error updating user!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'User successfully updated!',
        color: 'green',
        autoClose: 5000,
      });
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
    closeEdit();
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
