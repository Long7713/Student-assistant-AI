import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Lazy state initialization: runs only once on mount
  const [storedValue, setStoredValue] = useState<T>(() => {
    return loadFromStorage(key, initialValue);
  });

  // Keep localStorage in sync whenever storedValue changes
  useEffect(() => {
    saveToStorage(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
