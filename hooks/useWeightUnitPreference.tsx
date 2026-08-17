import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WeightUnit = 'KG' | 'LBS';

const STORAGE_KEY = 'preference:weightUnit';
const KG_PER_LB = 0.453592;

export function kgToLbs(kg: number) {
  return kg / KG_PER_LB;
}

export function lbsToKg(lbs: number) {
  return lbs * KG_PER_LB;
}

type WeightUnitContextValue = {
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
  convert: (value: number, from: WeightUnit) => number;
};

const WeightUnitContext = createContext<WeightUnitContextValue | null>(null);

export function WeightUnitProvider({ children }: { children: ReactNode }) {
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>('LBS');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'KG' || stored === 'LBS') setWeightUnitState(stored);
    });
  }, []);

  const setWeightUnit = (unit: WeightUnit) => {
    setWeightUnitState(unit);
    AsyncStorage.setItem(STORAGE_KEY, unit).catch(() => {});
  };

  const value = useMemo<WeightUnitContextValue>(
    () => ({
      weightUnit,
      setWeightUnit,
      convert: (value: number, from: WeightUnit) => {
        if (from === weightUnit) return value;
        return from === 'KG' ? kgToLbs(value) : lbsToKg(value);
      },
    }),
    [weightUnit]
  );

  return <WeightUnitContext.Provider value={value}>{children}</WeightUnitContext.Provider>;
}

export function useWeightUnitPreference() {
  const ctx = useContext(WeightUnitContext);
  if (!ctx) throw new Error('useWeightUnitPreference must be used within a WeightUnitProvider');
  return ctx;
}
