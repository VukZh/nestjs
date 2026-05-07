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
import { type TagType } from '../../../backend/src/models/types.ts';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../utils/notifications.tsx';
import { useCookies } from 'react-cookie';
import { fetchWithAuth } from '../utils/fetchWithAuth.ts';
import { API_URL } from '../config.ts';

export const Tags = () => {
  const [cookies] = useCookies(['token']);
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

  const getCommonHeaders = () => ({
    'Content-Type': 'application/json',
  });

  const handleReload = async () => {
    try {
      const resp = await fetch(`${API_URL}/tags`);
      if (!resp.ok) {
        showErrorNotification('Error loading tags', await resp.json());
        return;
      }
      const data = await resp.json();
      setTags(data);
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };
  const handleAdd = async (values: Pick<TagType, 'name'>) => {
    try {
      const { name } = values;
      const resp = await fetchWithAuth(
        `${API_URL}/tags`,
        {
          method: 'POST',
          headers: getCommonHeaders(),
          body: JSON.stringify({
            name,
          }),
        },
        cookies.token,
      );
      if (!resp.ok) {
        showErrorNotification('Error adding tag', await resp.json());
        return;
      }
      showSuccessNotification('Tag successfully added!');
      handleReload();
      close();
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const resp = await fetchWithAuth(
        `${API_URL}/tags/${id}`,
        {
          method: 'DELETE',
          headers: getCommonHeaders(),
        },
        cookies.token,
      );
      if (!resp.ok) {
        showErrorNotification('Error deleting tag', await resp.json());
        return;
      }
      showSuccessNotification('Tag successfully deleted!');
      handleReload();
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
  };

  useEffect(() => {
    const getTag = async (id: string) => {
      if (!id) return;
      try {
        const resp = await fetch(`${API_URL}/tags/${id}`);
        if (!resp.ok) {
          showErrorNotification('Error loading tag', await resp.json());
          return;
        }
        const data = await resp.json();
        formEdit.setValues(data);
      } catch (e) {
        showErrorNotification('Error', e as Error);
      }
    };
    getTag(selectedTag);
  }, [selectedTag]);

  const handleUpdate = async (values: Pick<TagType, 'name'>) => {
    try {
      const { name } = values;
      const resp = await fetchWithAuth(
        `${API_URL}/tags/${selectedTag}`,
        {
          method: 'PATCH',
          headers: getCommonHeaders(),
          body: JSON.stringify({
            name,
          }),
        },
        cookies.token,
      );
      if (!resp.ok) {
        showErrorNotification('Error updating tag', await resp.json());
        return;
      }
      showSuccessNotification('Tag successfully updated!');
      handleReload();
      closeEdit();
    } catch (e) {
      showErrorNotification('Error', e as Error);
    }
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
            label="Name"
            placeholder="name"
            key={form.key('name')}
            {...form.getInputProps('name')}
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
            label="Name"
            placeholder="name"
            key={formEdit.key('name')}
            {...formEdit.getInputProps('name')}
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
