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
import { type TaskType } from '../../../backend/src/models/task.ts';
import { useEffect, useReducer, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { type TagType } from '../../../backend/src/models/tag.ts';
import { type UserType } from '../../../backend/src/models/user.ts';
import { useForm } from '@mantine/form';

type TaskExtendedType = TaskType & { comments: string[]; tags: string[] };

type ActionsOnTasksType = {
  user?: UserType;
  setUser?: (user: UserType) => void;
};

export const ActionsOnTasks = (props: ActionsOnTasksType) => {
  const { user, setUser } = props;
  const [tasks, setTasks] = useState<TaskExtendedType[]>([]);
  const [openedFilter, { open: openFilter, close: closeFilter }] =
    useDisclosure(false);

  const [opened, { open: open, close: close }] = useDisclosure(false);

  const [users, setUsers] = useState<UserType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);



  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      content: '',
      status: '',
      authorId: '',
      tags: [],
      comments: [],
    },
  });

  const handleGetUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleGetTags = async () => {
    try {
      const response = await fetch('http://localhost:3000/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    const getUsersAndTags = async () => {
      await handleGetUsers();
      await handleGetTags();
    };
    const interval = setInterval(getUsersAndTags, 2000);
    return () => clearInterval(interval);
  }, []);

  const reducer = (state: any, action: any) => {
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

  const [filterState, filterDispatch] = useReducer(reducer, {
    tags: [],
    status: '',
    authors: [],
    page: 1,
    limit: 10,
  });

  return (
    <div style={{ margin: '1rem' }}>
      <Divider my="xs" label="Select user" labelPosition="left" />
      <Select
        placeholder="Select user"
        data={users.map((u) => ({ value: u.id!.toString(), label: u.name }))}
        value={user?.id?.toString()}
        onChange={(value) => {
          const selectedUser = users.find((u) => u.id === Number(value));
          if (selectedUser) {
            setUser && setUser(selectedUser);
          }
        }}
      ></Select>
      <Divider my="xs" label="Add task" labelPosition="left" />
      <ActionIcon variant="filled" color="lime" onClick={open} disabled={!user}>
        <TbCategoryPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
      <Divider my="xs" label="Edit/Delete task" labelPosition="left" />
      <Flex align="center" gap="xs">
        <Input placeholder="Input task ID" />
        <ActionIcon variant="filled" color="orange">
          <TbCategory style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
        <ActionIcon variant="filled" color="red">
          <TbCategoryMinus style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Flex>
      <Divider my="xs" label="Tasks table" labelPosition="left" />
      <Flex align="center" gap="xs" mb="xs">
        <ActionIcon variant="filled">
          <TbReload
            style={{ width: '70%', height: '70%' }}
            onClick={() => console.log('Reload', filterState)}
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
            filterDispatch({ type: 'status', payload: value })
          }
          defaultValue={filterState.status}
        />
        <MultiSelect
          clearable
          data={users.map((u) => ({ value: u.id!.toString(), label: u.name }))}
          label="Authors"
          placeholder="Select authors"
          onChange={(value) =>
            filterDispatch({ type: 'authors', payload: value })
          }
          defaultValue={filterState.authors}
        />
        <NumberInput
          label="Page"
          placeholder="Enter page number"
          min={1}
          onChange={(value) => filterDispatch({ type: 'page', payload: value })}
          defaultValue={filterState.page}
        />
        <NumberInput
          label="Limit"
          placeholder="Enter limit number"
          min={1}
          onChange={(value) =>
            filterDispatch({ type: 'limit', payload: value })
          }
          defaultValue={filterState.limit}
        />
      </Modal>
      <Modal opened={opened} onClose={close} title="Add" centered>
        <form
          onSubmit={form.onSubmit((values) =>
            handleAdd(
              values as Pick<
                TaskType,
                'title' | 'content' | 'status' | 'authorId'
              > & { tags: string[]; comments: string[] },
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

          <MultiSelect
            clearable
            data={tags.map((t) => ({ value: t.id!.toString(), label: t.name }))}
            label="Tags"
            placeholder="Select tags"
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

const rows = (
  elements: (TaskType & { comments: string[]; tags: string[] })[],
) => {
  return elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.title}</Table.Td>
      <Table.Td>{element.content}</Table.Td>
      <Table.Td>{element.authorId}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>{element.comments}</Table.Td>
      <Table.Td>{element.tags}</Table.Td>
    </Table.Tr>
  ));
};
