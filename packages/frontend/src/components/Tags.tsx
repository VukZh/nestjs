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
} from '@mantine/core';
import {
  TbReload,
  TbCategoryPlus,
  TbCategoryMinus,
  TbCategory,
} from 'react-icons/tb';
import { useEffect, useState } from 'react';
import { type TagType } from '../../../backend/src/models/tag.ts';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { PORT } from '../App.tsx';
import { notifications } from '@mantine/notifications';

export const Tags = () => {
  const [selectedTag, setSelectedTag] = useDebouncedState('', 500);
  const [tags, setTags] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
    },
  });
  const formEdit = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
    },
  });
  const handleReload = async () => {
    try {
      const resp = await fetch(`http://localhost:${PORT}/tags`);
      if (!resp.ok) {
        notifications.show({
          message: 'Error loading tags!',
          color: 'red',
          autoClose: 5000,
        });
      }
      const data = await resp.json();
      setTags(data);
      notifications.show({
        message: 'Tags successfully loaded!',
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
    values: Pick<TagType, 'name'>,
  ) => {
    console.log(values);
    try {
      const { name } = values;
      const resp = await fetch(`http://localhost:${PORT}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });
      if (!resp.ok) {
        notifications.show({
          message: 'Error adding tag!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'Tag successfully added!',
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
      const resp = await fetch(`http://localhost:${PORT}/tags/${id}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        notifications.show({
          message: 'Error deleting tag!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'Tag successfully deleted!',
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
    const getTag = async (id: string) => {
      const resp = await fetch(`http://localhost:${PORT}/tags/${id}`);
      const data = await resp.json();
      formEdit.setValues(data);
    };
    try {
      getTag(selectedTag);
    } catch (e) {
      console.log(e);
    }
  }, [selectedTag]);

  const handleUpdate = async (
    values: Pick<TagType, 'name'>,
  ) => {
    try {
      const { name } = values;
      const resp = await fetch(
        `http://localhost:${PORT}/tags/${selectedTag}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            id: selectedTag
          }),
        },
      );
      if (!resp.ok) {
        notifications.show({
          message: 'Error updating tag!',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }
      await resp.json();
      notifications.show({
        message: 'Tag successfully updated!',
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
        <Text size="sm">Tags table:</Text>
      </Flex>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>{head}</Table.Thead>
        <Table.Tbody>
          {tags.length ? rows(tags) : <Text size="xs">No data</Text>}
        </Table.Tbody>
      </Table>
      <ActionIcon variant="filled" color="lime" onClick={open}>
        <TbCategoryPlus style={{ width: '70%', height: '70%' }} />
      </ActionIcon>

      <Flex gap="xs" align="center">
        <Input
          placeholder="Input tag ID"
          onChange={(e) => setSelectedTag(e.currentTarget.value)}
        />
        <ActionIcon
          variant="filled"
          color="red"
          onClick={() => handleDelete(selectedTag)}
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
            handleAdd(values as Pick<TagType, 'name'>),
          )}
        >
          <TextInput
            withAsterisk
            label="Tag"
            placeholder="tag"
            key={form.key('tag')}
            {...form.getInputProps('tag')}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Modal>
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit" centered>
        <form
          onSubmit={formEdit.onSubmit((values) =>
            handleUpdate(values as Pick<TagType, 'name'>),
          )}
        >
          <TextInput
            label="Tag"
            placeholder="tag"
            key={formEdit.key('tag')}
            {...formEdit.getInputProps('tag')}
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
    <Table.Th>tag</Table.Th>
  </Table.Tr>
);

const rows = (elements: TagType[]) => {
  return elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
    </Table.Tr>
  ));
};
