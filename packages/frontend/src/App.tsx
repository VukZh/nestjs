import { useEffect, useState } from 'react';
import './App.css';
import { Accordion, AccordionControl, AppShell, Button } from '@mantine/core';
import { Users } from './components/Users.tsx';
import { Comments } from './components/Comments.tsx';
import { Tags } from './components/Tags.tsx';
import { ActionsOnTasks } from './components/ActionsOnTasks.tsx';
import type { UserType } from 'backend/dist/src/models/user.ts';
import { showErrorNotification } from './utils/notifications.tsx';
import { Auth } from './components/auth.tsx';
import { useCookies } from 'react-cookie';
import { fetchWithAuth } from './utils/fetchWithAuth.ts';

export const PORT = import.meta.env.VITE_PORT;

function App() {
  const [currentUser, setCurrentUser] = useState<
    Pick<UserType, 'id' | 'email' | 'role'> | undefined
  >(undefined);

  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        if (cookies.token && !currentUser) {
          const response = await fetchWithAuth(
            `http://localhost:${PORT}/auth/me`,
            {},
            cookies.token,
          );
          const data = await response.json();
          if (!response.ok) {
            showErrorNotification('Failed to get current user', data);
          } else {
            setCurrentUser(data);
          }
        }
      } catch (e) {
        showErrorNotification('Failed to get current user', e as Error);
      }
    };
    getCurrentUser();
  }, [cookies.token]);

  function handleSetToken(token: string) {
    setCookie('token', token, { path: '/' });
  }

  function handleRemoveToken() {
    removeCookie('token');
  }

  const hasToken = cookies.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:${PORT}`);
        const data = await response.json();
        if (!response.ok) {
          showErrorNotification('Server check failed', data);
        }
      } catch (e) {
        showErrorNotification('Server check failed', e as Error);
      }
    };
    fetchData();
  }, []);

  return (
    <AppShell>
      <AppShell.Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '31px',
        }}
      >
        <div>NestJS + React</div>
        {hasToken && (
          <>
            {currentUser && <div>{currentUser.email}</div>}
            <Button
              size="xs"
              variant="subtle"
              color="red"
              onClick={handleRemoveToken}
            >
              LogOut
            </Button>
          </>
        )}
      </AppShell.Header>

      <AppShell.Main style={{ paddingTop: '24px' }}>
        {hasToken ? (
          <>
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
                  <Users />
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
                  <Comments user={currentUser} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <ActionsOnTasks user={currentUser || undefined} />
          </>
        ) : (
          <Auth setToken={handleSetToken} setUser={setCurrentUser} />
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
