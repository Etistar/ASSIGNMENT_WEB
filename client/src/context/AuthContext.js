import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';
import { clearAuth, readAuth, writeAuth } from '../api/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readAuth());

  const signIn = useCallback((next) => {
    writeAuth(next);
    setSession({ token: next.token, user: next.user });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api('/api/auth/signout', { method: 'POST' });
    } catch (err) {
      // The API keeps no session. The browser must still drop the token.
    }
    clearAuth();
    setSession(null);
  }, []);

  const value = useMemo(() => ({
    token: session?.token || '',
    user: session?.user || null,
    isAdmin: session?.user?.role === 'admin',
    signIn,
    signOut
  }), [session, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
