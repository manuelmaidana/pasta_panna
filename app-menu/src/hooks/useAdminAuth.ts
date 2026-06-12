import { useState, useEffect } from 'react';
import { writeAdminSession, listenAdminSession } from '../lib/firestoreService';

const SESSION_KEY = 'pp_admin_token';

function generateToken(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function useAdminAuth() {
  const [authed, setAuthed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsub = listenAdminSession((remoteToken) => {
      const local = sessionStorage.getItem(SESSION_KEY);
      const valid = !!local && local === remoteToken;
      if (!valid && local) {
        // Another device logged in — invalidate this session
        sessionStorage.removeItem(SESSION_KEY);
      }
      setAuthed(valid);
      setIsChecking(false);
    });
    return unsub;
  }, []);

  async function login(username: string, password: string): Promise<boolean> {
    if (username === 'ABC' && password === '123') {
      const token = generateToken();
      sessionStorage.setItem(SESSION_KEY, token);
      await writeAdminSession(token);
      // onSnapshot fires immediately after write and sets authed = true
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  return { authed, isChecking, login, logout };
}
