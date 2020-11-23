import { useState } from "react";

// https://usehooks.com/useLocalStorage/
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: ((s: T) => T) | T) => void, () => T] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: ((s: T) => T) | T) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  // 直接localStorageから値を取得する。
  const getValueDirectly = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  };

  return [storedValue, setValue, getValueDirectly];
}
