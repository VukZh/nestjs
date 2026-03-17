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

export const Comments = () => {
  const [selectedComment, setSelectedComment] = useDebouncedState('', 500);
  const [comments, setComments] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      authorId: '',
      status: '',
      content: '',
    },
  });
  const formEdit = useForm({
    mode: 'uncontrolled',
    initialValues: {
      authorId: '',
      status: '',
      content: '',
    },
  });
  const handleReload = async () => {
    try {
      const resp = await fetch(`http://localhost:${PORT}/comments`);
      if (!resp.ok) {
        notifications.show({
          message: 'Error loading comments!',
          color: 'red',
          autoClose: 5000,
        });
      }
      const data = await resp.json();
      setComments(data);
      notifications.show({
        message: 'Comments successfully loaded!',
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
    values: Pick<CommentType, 'status' | 'authorId' | 'content'>,
  ) => {
    try {
      const { authorId, status, content } = values;
      const resp = await fetch(`http://localhost:${PORT}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId,
          status,
          content,
        }),
      });
      if (!resp.ok) {
        notifications.show({
          message: 'Error adding comment!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'Comment successfully added!',
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
      const resp = await fetch(`http://localhost:${PORT}/comments/${id}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        notifications.show({
          message: 'Error deleting comment!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'Comment successfully deleted!',
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
    const getComment = async (id: string) => {
      const resp = await fetch(`http://localhost:${PORT}/comments/${id}`);
      const data = await resp.json();
      formEdit.setValues(data);
    };
    try {
      getComment(selectedComment);
    } catch (e) {
      console.log(e);
    }
  }, [selectedComment]);

  const handleUpdate = async (
    values: Pick<CommentType, 'status' | 'authorId'>,
  ) => {
    try {
      const { authorId, status } = values;
      const resp = await fetch(
        `http://localhost:${PORT}/comments/${selectedComment}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorId,
            status,
            id: selectedComment,
          }),
        },
      );
      if (!resp.ok) {
        notifications.show({
          message: 'Error updating comment!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'Comment successfully updated!',
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
        <ActionIcon variant="filled" color="orange" onClick={openEdit}>
          <TbCategory style={{ width: '70%', height: '70%' }} />
        </ActionIcon>
      </Flex>
      <Modal opened={opened} onClose={close} title="Add" centered>
        <form
          onSubmit={form.onSubmit((values) =>
            handleAdd(
              values as Pick<CommentType, 'status' | 'authorId' | 'content'>,
            ),
          )}
        >
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
            data={['visible', 'hidden']}
            key={form.key('status')}
            {...form.getInputProps('status')}
          />

          <TextInput
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
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit" centered>
        <form
          onSubmit={formEdit.onSubmit((values) =>
            handleUpdate(
              values as Pick<CommentType, 'status' | 'authorId' | 'content'>,
            ),
          )}
        >
          <TextInput
            label="AuthorId"
            placeholder="authorId"
            key={formEdit.key('authorId')}
            {...formEdit.getInputProps('authorId')}
          />

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
            key={formEdit.key('comment')}
            {...formEdit.getInputProps('comment')}
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
    <Table.Th>status</Table.Th>
    <Table.Th>comment</Table.Th>
  </Table.Tr>
);

const rows = (elements: CommentType[]) => {
  return elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.authorId}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>{element.content}</Table.Td>
    </Table.Tr>
  ));
};
