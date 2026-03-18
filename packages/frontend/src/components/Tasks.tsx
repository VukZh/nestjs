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
import { type TaskType } from '../../../backend/src/models/task.ts';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { PORT } from '../App.tsx';
import { notifications } from '@mantine/notifications';
import { type UserType } from '../../../backend/src/models/user.ts';

type TasksProps = {
  user?: UserType;
};

export const Tasks = (props: TasksProps) => {
  const { user } = props;
  const [selectedTask, setSelectedTask] = useDebouncedState('', 500);
  const [tasks, setTasks] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      content: '',
      status: 'draft',
      authorId: user?.id || 0,
    },
  });
  const formEdit = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      content: '',
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
      const resp = await fetch(`http://localhost:${PORT}/tasks`);
      if (!resp.ok) {
        notifications.show({
          message: 'Error loading tasks!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      const data = await resp.json();
      setTasks(data);
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
  };
  const handleAdd = async (
    values: Pick<TaskType, 'title' | 'content' | 'status' | 'authorId'>,
  ) => {
    try {
      const { title, content, status, authorId } = values;
      const resp = await fetch(`http://localhost:${PORT}/tasks`, {
        method: 'POST',
        headers: getCommonHeaders(),
        body: JSON.stringify({
          title,
          content,
          status,
          authorId: +authorId,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        notifications.show({
          message: 'Error adding task: ' + (err.message || 'Access denied'),
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      notifications.show({
        message: 'Task successfully added!',
        color: 'green',
        autoClose: 5000,
      });
      handleReload();
      close();
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const resp = await fetch(`http://localhost:${PORT}/tasks/${id}`, {
        method: 'DELETE',
        headers: getCommonHeaders(),
      });
      if (!resp.ok) {
        const err = await resp.json();
        notifications.show({
          message: 'Error deleting task: ' + (err.message || 'Access denied'),
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      notifications.show({
        message: 'Task successfully deleted!',
        color: 'green',
        autoClose: 5000,
      });
      handleReload();
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    const getTask = async (id: string) => {
      if (!id) return;
      const resp = await fetch(`http://localhost:${PORT}/tasks/${id}`);
      if (resp.ok) {
        const data = await resp.json();
        formEdit.setValues(data);
      }
    };
    getTask(selectedTask);
  }, [selectedTask]);

  const handleUpdate = async (
    values: Pick<TaskType, 'title' | 'content' | 'status'>,
  ) => {
    try {
      const { title, content, status } = values;
      const resp = await fetch(
        `http://localhost:${PORT}/tasks/${selectedTask}`,
        {
          method: 'PATCH',
          headers: getCommonHeaders(),
          body: JSON.stringify({
            title,
            content,
            status,
          }),
        },
      );
      if (!resp.ok) {
        const err = await resp.json();
        notifications.show({
          message: 'Error updating task: ' + (err.message || 'Access denied'),
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      notifications.show({
        message: 'Task successfully updated!',
        color: 'green',
        autoClose: 5000,
      });
      handleReload();
      closeEdit();
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  return (
    <Flex direction="column" gap="xs">
      <Flex align="center" gap="md">
        <ActionIcon variant="filled" onClick={handleReload}>
          <TbReload style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
        <Text size="sm">Tasks table:</Text>
      </Flex>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>{head}</Table.Thead>
        <Table.Tbody>
          {tasks.length ? rows(tasks) : <Text size="xs">No data</Text>}
        </Table.Tbody>
      </Table>
      <ActionIcon
        variant="filled"
        color="lime"
        onClick={open}
      >
        <TbCategoryPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>

      <Flex gap="xs" align="center">
        <Input
          placeholder="Input task ID"
          onChange={(e) => setSelectedTask(e.currentTarget.value)}
        />
        <ActionIcon
          variant="filled"
          color="red"
          onClick={() => handleDelete(selectedTask)}
        >
          <TbCategoryMinus style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
        <ActionIcon
          variant="filled"
          color="orange"
          onClick={openEdit}
        >
          <TbCategory style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Flex>
      <Modal opened={opened} onClose={close} title="Add" centered>
        <form
          onSubmit={form.onSubmit((values) =>
            handleAdd(
              values as Pick<
                TaskType,
                'title' | 'content' | 'status' | 'authorId'
              >,
            ),
          )}
        >
          <TextInput
            withAsterisk
            label="Title"
            placeholder="title"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />

          <TextInput
            withAsterisk
            label="Content"
            placeholder="content"
            key={form.key('content')}
            {...form.getInputProps('content')}
          />

          <TextInput
            withAsterisk
            label="AuthorId"
            placeholder="authorId"
            key={form.key('authorId')}
            {...form.getInputProps('authorId')}
          />

          <Select
            withAsterisk
            label="Status"
            placeholder="Pick Status"
            data={['draft', 'published']}
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
              values as Pick<
                TaskType,
                'title' | 'content' | 'status'
              >,
            ),
          )}
        >
          <TextInput
            label="Title"
            placeholder="title"
            key={formEdit.key('title')}
            {...formEdit.getInputProps('title')}
          />

          <TextInput
            label="Content"
            placeholder="content"
            key={formEdit.key('content')}
            {...formEdit.getInputProps('content')}
          />

          <Select
            label="Status"
            placeholder="Pick Status"
            data={['draft', 'published']}
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
    <Table.Th>title</Table.Th>
    <Table.Th>content</Table.Th>
    <Table.Th>authorId</Table.Th>
    <Table.Th>status</Table.Th>
  </Table.Tr>
);

const rows = (elements: TaskType[]) => {
  return elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.title}</Table.Td>
      <Table.Td>{element.content}</Table.Td>
      <Table.Td>{element.authorId}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
    </Table.Tr>
  ));
};
