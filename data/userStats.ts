import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export type UserStats = {
  gender?: 'MALE' | 'FEMALE';
  age: number;
  weightUnit?: 'LBS' | 'KG';
  weight: number;
  heightUnit?: 'CM' | 'FT-IN';
  height: number;
  heightFeet?: number;
  heightInches?: number;
  injuries?: string[];
  notes?: string;
};

export async function getUserStats(uid: string): Promise<UserStats | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserStats) : null;
}

export async function saveUserStats(uid: string, stats: UserStats): Promise<void> {
  await setDoc(
    doc(db, 'users', uid),
    { ...stats, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
