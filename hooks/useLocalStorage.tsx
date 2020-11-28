import { Dispatch, SetStateAction, useEffect, useState } from "react";

// 同一keyを持つhook全てを更新するための変数
const UPDATERS: Record<
  string,
  Dispatch<SetStateAction<any>>[] | undefined
> = {};

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: ((s: T) => T) | T) => void] {
  const [buffer, setBuffer] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // localStorageとbuffer両方をセットする
  const setValue = (value: ((s: T) => T) | T) => {
    const valueToStore = value instanceof Function ? value(buffer) : value;
    window.localStorage.setItem(key, JSON.stringify(valueToStore));

    // 同一keyを持つhookすべてを更新する
    UPDATERS[key]?.forEach((updater) => updater(valueToStore));
  };

  // UPDATERSにuseStateの更新関数を登録、解除する
  useEffect(() => {
    if (UPDATERS[key] === undefined) {
      UPDATERS[key] = [];
    }
    UPDATERS[key]?.push(setBuffer);

    return () => {
      if (UPDATERS[key] === undefined) {
        return;
      }
      const index = UPDATERS[key]?.indexOf(setBuffer) as number;
      UPDATERS[key]?.splice(index, 1);
    };
  }, [key]);

  return [buffer, setValue];
}
