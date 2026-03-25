import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Group,
  Input,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import {
  TbCategory,
  TbCategoryMinus,
  TbCategoryPlus,
  TbReload,
  TbFilter,
} from 'react-icons/tb';
import {
  type TaskType,
  type TagType,
  type UserType,
} from '../../../backend/src/models/types.ts';
import { useEffect, useReducer, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../utils/notifications.tsx';
import { PORT } from '../App.tsx';
import { fetchWithAuth } from '../utils/fetchWithAuth.ts';
import { useCookies } from 'react-cookie';

type TaskExtendedType = TaskType & {
  comments: { content: string }[];
  tags: { id: number; name: string }[];
};

type ActionsOnTasksType = {
  user?: Pick<UserType, 'id' | 'email' | 'role'>;
};

type FilterState = {
  tags: string[];
  status: string;
  authors: string[];
  page: number;
  limit: number;
};

type FilterAction =
  | { type: 'tags'; payload: string[] }
  | { type: 'status'; payload: string }
  | { type: 'authors'; payload: string[] }
  | { type: 'page'; payload: number }
  | { type: 'limit'; payload: number };

const initialState: FilterState = {
  tags: [],
  status: '',
  authors: [],
  page: 1,
  limit: 10,
};

export const ActionsOnTasks = ({ user }: ActionsOnTasksType) => {
  const [cookies] = useCookies(['token']);
  const [tasks, setTasks] = useState<TaskExtendedType[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [openedFilter, { open: openFilter, close: closeFilter }] =
    useDisclosure(false);

  const [opened, { open: open, close: close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const [tags, setTags] = useState<TagType[]>([]);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      content: '',
      status: '',
      tags: [],
      comment: '',
    },
  });

  const formEdit = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      content: '',
      status: '',
      tagIds: [] as string[],
      comment: '',
    },
  });

  const handleGetTags = async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/tags`);
      if (!response.ok) {
        showErrorNotification('Error loading tags', await response.json());
        return;
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      showErrorNotification('Error fetching tags', error as Error);
    }
  };

  useEffect(() => {
    const getUsersAndTags = async () => {
      await handleGetTags();
    };
    const interval = setInterval(getUsersAndTags, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filterState.page) {
        params.append('page', filterState.page.toString());
      }
      if (filterState.limit) {
        params.append('limit', filterState.limit.toString());
      }
      filterState.tags.forEach((tag: string) => {
        params.append('tagIds', tag);
      });
      filterState.authors.forEach((author: string) => {
        params.append('authorIds', author);
      });
      if (filterState.status) {
        params.append('status', filterState.status);
      }
      const response = await fetch(
        `http://localhost:${PORT}/tasks?${params.toString()}`,
      );
      if (!response.ok) {
        showErrorNotification('Error loading tasks', await response.json());
        return;
      }
      const data = await response.json();
      setTasks(data);
      showSuccessNotification('Tasks successfully loaded!');
    } catch (error) {
      showErrorNotification('Error fetching tasks', error as Error);
    }
  };

  const reducer = (state: FilterState, action: FilterAction): FilterState => {
    switch (action.type) {
      case 'tags': {
        return { ...state, tags: action.payload };
      }
      case 'status': {
        return { ...state, status: action.payload };
      }
      case 'authors': {
        return { ...state, authors: action.payload };
      }
      case 'page': {
        return { ...state, page: action.payload };
      }
      case 'limit': {
        return { ...state, limit: action.payload };
      }
      default: {
        return state;
      }
    }
  };

  const [filterState, filterDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (user) {
      form.setFieldValue('authorId', user.id.toString());
    }
  }, [user, opened]);

  const handleAdd = async (values: {
    title: string;
    content: string;
    status: string;
    tags: string[];
    comment: string;
  }) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        status: values.status,
        tagIds: values.tags.map(Number),
        comment: values.comment,
        authorId: user?.id,
      };
      const resp = await fetch(`http://localhost:${PORT}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id?.toString() || '',
          'x-user-role': user?.role || '',
        },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        close();
        form.reset();
        handleGetTasks();
        showSuccessNotification('Task successfully created!');
      } else {
        showErrorNotification('Error adding task', await resp.json());
      }
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const resp = await fetchWithAuth(
        `http://localhost:${PORT}/tasks/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.id?.toString() || '',
            'x-user-role': user?.role || '',
          },
        },
        cookies.token,
      );
      if (resp.ok) {
        handleGetTasks();
        showSuccessNotification('Task successfully deleted!');
      } else {
        showErrorNotification('Error deleting task', await resp.json());
      }
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };

  const handleOpenEdit = async () => {
    if (!selectedTaskId) {
      showErrorNotification('Input required', {
        message: 'Please input task ID',
      });
      return;
    }
    try {
      const resp = await fetch(
        `http://localhost:${PORT}/tasks/${selectedTaskId}`,
      );
      if (resp.ok) {
        const data = (await resp.json()) as TaskExtendedType;
        formEdit.setValues({
          title: data.title,
          content: data.content,
          status: data.status,
          tagIds: data.tags?.map((t) => t.id.toString()) || [],
          comment: '',
        });
        openEdit();
      } else {
        showErrorNotification('Task not found', await resp.json());
      }
    } catch (e) {
      showErrorNotification('Error fetching task', e as Error);
    }
  };

  const handleUpdate = async (values: {
    title: string;
    content: string;
    status: string;
    tagIds: string[];
    comment: string;
  }) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        status: values.status,
        tagIds: values.tagIds.map(Number),
        comment: values.comment,
      };
      const resp = await fetchWithAuth(
        `http://localhost:${PORT}/tasks/${selectedTaskId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.id?.toString() || '',
            'x-user-role': user?.role || '',
          },
          body: JSON.stringify(payload),
        },
        cookies.token,
      );
      if (resp.ok) {
        closeEdit();
        handleGetTasks();
        showSuccessNotification('Task successfully updated!');
      } else {
        showErrorNotification('Something went wrong!', await resp.json());
      }
    } catch (e) {
      showErrorNotification('Something went wrong!', e as Error);
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <Divider my="xs" label="Add task" labelPosition="left" />
      <ActionIcon variant="filled" color="lime" onClick={open}>
        <TbCategoryPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
      <Divider my="xs" label="Edit/Delete task" labelPosition="left" />
      <Flex align="center" gap="xs">
        <Input
          placeholder="Input task ID"
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
        />
        <ActionIcon
          variant="filled"
          color="red"
          onClick={() => handleDelete(selectedTaskId)}
        >
          <TbCategoryMinus style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
        <ActionIcon variant="filled" color="orange" onClick={handleOpenEdit}>
          <TbCategory style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Flex>
      <Divider my="xs" label="Tasks table" labelPosition="left" />
      <Flex align="center" gap="xs" mb="xs">
        <ActionIcon variant="filled">
          <TbReload
            style={{ width: '70%', height: '70%' }}
            onClick={handleGetTasks}
          />
        </ActionIcon>

        <ActionIcon variant="filled" onClick={openFilter}>
          <TbFilter style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Flex>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>{head}</Table.Thead>
        <Table.Tbody>
          {tasks.length ? rows(tasks) : <Text size="xs">No data</Text>}
        </Table.Tbody>
      </Table>
      <Modal
        opened={openedFilter}
        onClose={closeFilter}
        title="Tasks filter"
        centered
      >
        <MultiSelect
          clearable
          data={tags.map((t) => ({ value: t.id!.toString(), label: t.name }))}
          label="Tags"
          placeholder="Select tags"
          onChange={(value) => filterDispatch({ type: 'tags', payload: value })}
          defaultValue={filterState.tags}
        />
        <Select
          label="Status"
          placeholder="Select status"
          clearable
          data={['draft', 'published']}
          onChange={(value) =>
            filterDispatch({ type: 'status', payload: value as string })
          }
          defaultValue={filterState.status}
        />
        <NumberInput
          label="Page"
          placeholder="Enter page number"
          min={1}
          onChange={(value) =>
            filterDispatch({ type: 'page', payload: value as number })
          }
          defaultValue={filterState.page}
        />
        <NumberInput
          label="Limit"
          placeholder="Enter limit number"
          min={1}
          onChange={(value) =>
            filterDispatch({ type: 'limit', payload: value as number })
          }
          defaultValue={filterState.limit}
        />
      </Modal>
      <Modal opened={opened} onClose={close} title="Add" centered>
        <form
          onSubmit={form.onSubmit((values) =>
            handleAdd(
              values as {
                title: string;
                content: string;
                status: string;
                tags: string[];
                comment: string;
              },
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

          <Select
            withAsterisk
            label="Status"
            placeholder="Pick Status"
            data={['draft', 'published']}
            key={form.key('status')}
            {...form.getInputProps('status')}
          />

          <MultiSelect
            clearable
            data={tags.map((t) => ({ value: t.id!.toString(), label: t.name }))}
            label="Tags"
            placeholder="Select tags"
            {...form.getInputProps('tags')}
          />

          <TextInput
            withAsterisk
            label="Comment"
            placeholder="comment"
            key={form.key('comment')}
            {...form.getInputProps('comment')}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Modal>

      <Modal opened={openedEdit} onClose={closeEdit} title="Edit Task" centered>
        <form
          onSubmit={formEdit.onSubmit((values) =>
            handleUpdate(
              values as {
                title: string;
                content: string;
                status: string;
                tagIds: string[];
                comment: string;
              },
            ),
          )}
        >
          <TextInput
            withAsterisk
            label="Title"
            placeholder="title"
            {...formEdit.getInputProps('title')}
          />

          <TextInput
            withAsterisk
            label="Content"
            placeholder="content"
            {...formEdit.getInputProps('content')}
          />

          <Select
            withAsterisk
            label="Status"
            placeholder="Pick Status"
            data={['draft', 'published']}
            {...formEdit.getInputProps('status')}
          />

          <MultiSelect
            clearable
            data={tags.map((t) => ({ value: t.id!.toString(), label: t.name }))}
            label="Tags"
            placeholder="Select tags"
            {...formEdit.getInputProps('tagIds')}
          />

          <TextInput
            label="Add Comment (Optional)"
            placeholder="Write a comment about this update"
            {...formEdit.getInputProps('comment')}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Update</Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
};

const head = (
  <Table.Tr>
    <Table.Th>id</Table.Th>
    <Table.Th>title</Table.Th>
    <Table.Th>content</Table.Th>
    <Table.Th>authorId</Table.Th>
    <Table.Th>status</Table.Th>
    <Table.Th>comments</Table.Th>
    <Table.Th>tags</Table.Th>
  </Table.Tr>
);

const rows = (elements: TaskExtendedType[]) => {
  return elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.title}</Table.Td>
      <Table.Td>{element.content}</Table.Td>
      <Table.Td>{element.authorId}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>
        {element.comments?.map((comment) => comment.content).join(', ')}
      </Table.Td>
      <Table.Td>{element.tags?.map((tag) => tag.name).join(', ')}</Table.Td>
    </Table.Tr>
  ));
};
