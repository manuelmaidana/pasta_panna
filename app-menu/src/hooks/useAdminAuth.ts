import { useState } from 'react';

const AUTH_KEY = 'pp_admin_auth';

export function useAdminAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1');

  function login(username: string, password: string): boolean {
    if (username === 'ABC' && password === '123') {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }

  return { authed, login, logout };
}
