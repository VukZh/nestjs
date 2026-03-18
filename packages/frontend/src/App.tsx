import { useEffect, useState } from 'react';
import './App.css';
import { Accordion, AccordionControl, AppShell } from '@mantine/core';
import { Users } from './components/Users.tsx';
import { Comments } from './components/Comments.tsx';
import { Tags } from './components/Tags.tsx';
import { Tasks } from './components/Tasks.tsx';
import { ActionsOnTasks } from './components/ActionsOnTasks.tsx';
import type { UserType } from 'backend/dist/src/models/user.ts';

export const PORT = import.meta.env.VITE_PORT;

function App() {
  const [msg, setMsg] = useState('');
  const [currentUser, setCurrentUser] = useState<UserType | undefined>(undefined);

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
          // defaultValue={['users', 'tasks', 'tags', 'comments']}
          chevronPosition="left"
        >
          <Accordion.Item value="users">
            <AccordionControl style={{ backgroundColor: '#f5f5f5' }}>
              Users
            </AccordionControl>
            <Accordion.Panel>
              <Users user={currentUser} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="tasks">
            {' '}
            <AccordionControl style={{ backgroundColor: '#f5f5f5' }}>
              Tasks
            </AccordionControl>
            <Accordion.Panel>
              <Tasks user={currentUser} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="tags">
            {' '}
            <AccordionControl style={{ backgroundColor: '#f5f5f5' }}>
              Tags
            </AccordionControl>
            <Accordion.Panel>
              <Tags user={currentUser} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="comments">
            {' '}
            <AccordionControl style={{ backgroundColor: '#f5f5f5' }}>
              Comments
            </AccordionControl>
            <Accordion.Panel>
              <Comments user={currentUser} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <ActionsOnTasks user={currentUser || undefined} setUser={setCurrentUser || undefined} />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
