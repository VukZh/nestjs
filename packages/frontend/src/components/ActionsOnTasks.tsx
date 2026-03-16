import {
  ActionIcon,
  Divider,
  Flex,
  Input,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Table,
  Text,
} from '@mantine/core';
import {
  TbCategory,
  TbCategoryMinus,
  TbCategoryPlus,
  TbReload,
  TbFilter,
} from 'react-icons/tb';
import { type TaskType } from '../../../backend/src/models/task.ts';
import { useReducer, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';


type TaskExtendedType = TaskType & { comments: string[]; tags: string[] };

export const ActionsOnTasks = () => {
  const [tasks, setTasks] = useState<TaskExtendedType[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

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
    };
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
        data={['user1', 'user2', 'user3']}
      ></Select>
      <Divider my="xs" label="Add task" labelPosition="left" />
      <ActionIcon variant="filled" color="lime">
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
          <TbReload style={{ width: '70%', height: '70%' }} onClick={() => console.log('Reload', filterState)}/>
        </ActionIcon>

        <ActionIcon variant="filled" onClick={open}>
          <TbFilter style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Flex>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>{head}</Table.Thead>
        <Table.Tbody>
          {tasks.length ? rows(tasks) : <Text size="xs">No data</Text>}
        </Table.Tbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Tasks filter" centered>
        <MultiSelect
          clearable
          data={['sdfsdf1', '2sdfsdf']}
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
          onChange={(value) => filterDispatch({ type: 'status', payload: value })}
          defaultValue={filterState.status}
        />
        <MultiSelect
          clearable
          data={['sdfsdf1', '2sdfsdf']}
          label="Authors"
          placeholder="Select authors"
          onChange={(value) => filterDispatch({ type: 'authors', payload: value })}
          defaultValue={filterState.authors}
        />
        <NumberInput label="Page" placeholder="Enter page number" min={1}
          onChange={(value) => filterDispatch({ type: 'page', payload: value })}
          defaultValue={filterState.page}
        />
        <NumberInput label="Limit" placeholder="Enter limit number" min={1}
          onChange={(value) => filterDispatch({ type: 'limit', payload: value })}
          defaultValue={filterState.limit}
        />
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
