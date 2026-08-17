import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { auth } from '../firebase';

export function useAnonymousAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setReady(true);
      } else {
        signInAnonymously(auth).catch((err) => {
          console.error('Anonymous sign-in failed', err);
          setReady(true);
        });
      }
    });
    return unsubscribe;
  }, []);

  return { user, uid: user?.uid ?? null, ready };
}
