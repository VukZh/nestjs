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
import { type CommentType } from '../../../backend/src/models/comment.ts';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { PORT } from '../App.tsx';
import { notifications } from '@mantine/notifications';
import { type UserType } from '../../../backend/src/models/user.ts';

type CommentsProps = {
  user?: UserType;
};

export const Comments = (props: CommentsProps) => {
  const { user } = props;
  const [selectedComment, setSelectedComment] = useDebouncedState('', 500);
  const [comments, setComments] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      status: 'visible',
      content: '',
      taskId: '',
    },
  });
  const formEdit = useForm({
    mode: 'uncontrolled',
    initialValues: {
      status: '',
      content: '',
    },
  });

  const getCommonHeaders = () => ({
    'Content-Type': 'application/json',
    'x-user-id': user?.id?.toString() || '',
    'x-user-role': user?.role || '',
  });

  const handleReload = async () => {
    try {
      const url =
        user?.role === 'admin'
          ? `http://localhost:${PORT}/comments?all=true`
          : `http://localhost:${PORT}/comments`;
      const resp = await fetch(url);
      if (!resp.ok) {
        notifications.show({
          message: 'Error loading comments!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      const data = await resp.json();
      setComments(data);
    } catch (e) {
      notifications.show({
        message: 'Something went wrong!' + e,
        color: 'red',
        autoClose: 5000,
      });
    }
  };
  const handleAdd = async (values: {
    status: string;
    content: string;
    taskId: string;
  }) => {
    try {
      const resp = await fetch(`http://localhost:${PORT}/comments`, {
        method: 'POST',
        headers: getCommonHeaders(),
        body: JSON.stringify({
          status: values.status,
          content: values.content,
          taskId: +values.taskId,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        notifications.show({
          message: 'Error adding comment: ' + (err.message || 'Access denied'),
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      notifications.show({
        message: 'Comment successfully added!',
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
      const resp = await fetch(`http://localhost:${PORT}/comments/${id}`, {
        method: 'DELETE',
        headers: getCommonHeaders(),
      });
      if (!resp.ok) {
        const err = await resp.json();
        notifications.show({
          message: 'Error deleting comment: ' + (err.message || 'Access denied'),
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      notifications.show({
        message: 'Comment successfully deleted!',
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
    const getComment = async (id: string) => {
      if (!id) return;
      const resp = await fetch(`http://localhost:${PORT}/comments/${id}`);
      if (resp.ok) {
        const data = await resp.json();
        formEdit.setValues(data);
      }
    };
    getComment(selectedComment);
  }, [selectedComment]);

  const handleUpdate = async (
    values: Pick<CommentType, 'status' | 'content'>,
  ) => {
    try {
      const { status, content } = values;
      const resp = await fetch(
        `http://localhost:${PORT}/comments/${selectedComment}`,
        {
          method: 'PATCH',
          headers: getCommonHeaders(),
          body: JSON.stringify({
            status,
            content,
          }),
        },
      );
      if (!resp.ok) {
        const err = await resp.json();
        notifications.show({
          message: 'Error updating comment: ' + (err.message || 'Access denied'),
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      notifications.show({
        message: 'Comment successfully updated!',
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
        <Text size="sm">Comments table:</Text>
      </Flex>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>{head}</Table.Thead>
        <Table.Tbody>
          {comments.length ? rows(comments) : <Text size="xs">No data</Text>}
        </Table.Tbody>
      </Table>
      <ActionIcon variant="filled" color="lime" onClick={open}>
        <TbCategoryPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>

      <Flex gap="xs" align="center">
        <Input
          placeholder="Input comment ID"
          onChange={(e) => setSelectedComment(e.currentTarget.value)}
        />
        <ActionIcon
          variant="filled"
          color="red"
          onClick={() => handleDelete(selectedComment)}
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
            handleAdd(values as { status: string; content: string; taskId: string }),
          )}
        >
          <TextInput
            withAsterisk
            label="Task ID"
            placeholder="taskId"
            key={form.key('taskId')}
            {...form.getInputProps('taskId')}
          />

          <Select
            withAsterisk
            label="Status"
            placeholder="Pick Status"
            data={['visible', 'hidden']}
            key={form.key('status')}
            {...form.getInputProps('status')}
          />

          <TextInput
            label="Comment"
            placeholder="comment"
            key={form.key('content')}
            {...form.getInputProps('content')}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Modal>
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit" centered>
        <form
          onSubmit={formEdit.onSubmit((values) =>
            handleUpdate(values as Pick<CommentType, 'status' | 'content'>),
          )}
        >
          <Select
            label="Status"
            placeholder="Pick Status"
            data={['visible', 'hidden']}
            key={formEdit.key('status')}
            {...formEdit.getInputProps('status')}
          />

          <TextInput
            label="Comment"
            placeholder="comment"
            key={formEdit.key('content')}
            {...formEdit.getInputProps('content')}
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
    <Table.Th>authorId</Table.Th>
    <Table.Th>taskId</Table.Th>
    <Table.Th>status</Table.Th>
    <Table.Th>comment</Table.Th>
  </Table.Tr>
);

const rows = (elements: CommentType[]) => {
  return elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.authorId}</Table.Td>
      <Table.Td>{element.taskId}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>{element.content}</Table.Td>
    </Table.Tr>
  ));
};
