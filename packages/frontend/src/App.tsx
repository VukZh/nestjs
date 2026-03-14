import { useEffect, useState } from 'react';
import './App.css';
import { Accordion, AccordionControl, AppShell } from '@mantine/core';
import { Users } from './components/Users.tsx';

export const PORT = import.meta.env.VITE_PORT;

function App() {
  const [msg, setMsg] = useState('');

  console.log('msg', msg);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000');
      const data = await response.json();
      console.log(data);
      setMsg(data.message);
    };
    fetchData();
  }, []);

  return (
    <AppShell>
      <AppShell.Header>
        <div>NestJS + React</div>
      </AppShell.Header>

      <AppShell.Main style={{ paddingTop: '24px' }}>
        <Accordion
          multiple
          defaultValue={['users', 'tasks', 'tags', 'comments']}
          chevronPosition="left"
        >
          <Accordion.Item value="users">
            <AccordionControl>Users</AccordionControl>
            <Accordion.Panel><Users /></Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="tasks">
            {' '}
            <AccordionControl>Tasks</AccordionControl>
            <Accordion.Panel>Panel 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="tags">
            {' '}
            <AccordionControl>Tags</AccordionControl>
            <Accordion.Panel>Panel 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="comments">
            {' '}
            <AccordionControl>Comments</AccordionControl>
            <Accordion.Panel>Panel 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
