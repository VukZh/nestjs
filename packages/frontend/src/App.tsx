import { useEffect, useState } from 'react';
import './App.css';
import { Accordion, AccordionControl, AppShell } from '@mantine/core';
import { Users } from './components/Users.tsx';
import { Comments } from './components/Comments.tsx';
import { Tags } from './components/Tags.tsx';
import { Tasks } from './components/Tasks.tsx';

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
            <AccordionControl style={{ backgroundColor: '#f5f5f5' }}>
              Users
            </AccordionControl>
            <Accordion.Panel>
              <Users />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="tasks">
            {' '}
            <AccordionControl style={{ backgroundColor: '#f5f5f5' }}>
              Tasks
            </AccordionControl>
            <Accordion.Panel>
              <Tasks />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="tags">
            {' '}
            <AccordionControl style={{ backgroundColor: '#f5f5f5' }}>
              Tags
            </AccordionControl>
            <Accordion.Panel>
              <Tags />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="comments">
            {' '}
            <AccordionControl style={{ backgroundColor: '#f5f5f5' }}>
              Comments
            </AccordionControl>
            <Accordion.Panel>
              <Comments />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
