import {
  ActionIcon,
  Divider,
  Flex,
  Input,
  Select,
  Table,
  Text,
} from '@mantine/core';
import {
  TbCategory,
  TbCategoryMinus,
  TbCategoryPlus,
  TbReload,
} from 'react-icons/tb';
import type { TaskType } from 'backend/dist/models/task.ts';
import { useState } from 'react';

type TaskExtendedType = TaskType & { comments: string[]; tags: string[] };

export const ActionsOnTasks = () => {
  const [tasks, setTasks] = useState<TaskExtendedType[]>([]);
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
      <ActionIcon variant="filled">
        <TbReload style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>{head}</Table.Thead>
        <Table.Tbody>
          {tasks.length ? rows(tasks) : <Text size="xs">No data</Text>}
        </Table.Tbody>
      </Table>
    </div>
  );

}

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

const rows = (elements: (TaskType & { comments: string[], tags: string[] })[]) => {
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
