import { useState } from "react";
import useSWR from "swr";
import { CounterFields } from "../components/Counter";
import { Counter } from "../types/client";
import { fetcher } from "./fetcher";

export type useCountersResults = {
  counters: Counter[];
  addCounter: (counter: Counter) => Promise<void>;
  removeCounter: (id: string) => Promise<void>;
  editCounter: (id: string, fields: CounterFields) => Promise<void>;
  countUp: (id: string) => Promise<void>;
  countDown: (id: string) => Promise<void>;
  resetCount: (id: string) => Promise<void>;
};

// web apiを使用したバージョン
export function useRemoteCounters(): useCountersResults & {
  addCounters: (counters: Counter[]) => Promise<void>;
} {
  const { data: counters = [], mutate } = useSWR<Counter[]>(
    "/api/counters",
    fetcher
  );

  const addCounter = async (counter: Counter) => {
    mutate([...counters, counter], false);
    await fetcher("/api/counter/create", counter);
    mutate();
  };

  const addCounters = async (cs: Counter[]) => {
    mutate([...counters, ...cs], false);
    for (const c of cs) {
      await fetcher("/api/counter/create", c);
    }
    mutate();
  };

  const removeCounter = async (id: string) => {
    mutate(
      counters.filter((c) => c.id !== id),
      false
    );
    await fetcher("/api/counter/delete", { id });
    mutate();
  };

  const editCounter = async (id: string, fields: CounterFields) => {
    mutate(
      counters.map((counter) => {
        if (counter.id === id) {
          const newCounter: Counter = {
            ...counter,
            name: fields.name,
            startWith: fields.startWith,
            amount: fields.amount,
            maxValue: fields.maxValue,
            minValue: fields.minValue,
          };
          return newCounter;
        }
        return counter;
      }),
      false
    );
    await fetcher("/api/counter/update", { id, ...fields });
    mutate();
  };

  const countUp = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }
    if (target.value + target.amount > target.maxValue) {
      return;
    }

    mutate(
      counters.map((counter) => {
        if (counter.id === id) {
          const newCounter: Counter = {
            ...counter,
            value: counter.value + counter.amount,
          };
          return newCounter;
        }
        return counter;
      }),
      false
    );
    await fetcher("/api/counter/update", {
      id,
      value: target.value + target.amount,
    });
    mutate();
  };

  const countDown = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }
    if (target.value - target.amount < target.minValue) {
      return;
    }

    mutate(
      counters.map((counter) => {
        if (counter.id === id) {
          const newCounter: Counter = {
            ...counter,
            value: counter.value - counter.amount,
          };
          return newCounter;
        }
        return counter;
      }),
      false
    );
    await fetcher("/api/counter/update", {
      id,
      value: target.value - target.amount,
    });
    mutate();
  };

  const resetCount = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }

    mutate(
      counters.map((counter) => {
        if (counter.id === id) {
          const newCounter: Counter = {
            ...counter,
            value: counter.startWith,
          };
          return newCounter;
        }
        return counter;
      }),
      false
    );
    await fetcher("/api/counter/update", { id, value: 0 });
    mutate();
  };

  return {
    counters: counters || [],
    addCounter,
    addCounters,
    removeCounter,
    editCounter,
    countUp,
    countDown,
    resetCount,
  };
}

// localStorageを使用したバージョン
export function useLocalCounters(): useCountersResults & {
  clearCounters: () => void;
} {
  const [counters, setCounters] = useLocalStorage<Counter[]>("counters", []);

  const addCounter = async (counter: Counter) => {
    setCounters((counters) => [...counters, counter]);
  };

  const removeCounter = async (id: string) => {
    setCounters((counters) => counters.filter((c) => c.id !== id));
  };

  const editCounter = async (id: string, fields: CounterFields) => {
    setCounters((counters) =>
      counters.map((counter) => {
        if (counter.id === id) {
          return { ...counter, ...fields };
        }
        return counter;
      })
    );
  };

  const countUp = async (id: string) => {
    setCounters((counters) =>
      counters.map((counter) => {
        if (counter.id === id) {
          const newCounts = counter.value + counter.amount;
          if (newCounts <= counter.maxValue) {
            return { ...counter, value: newCounts };
          }
        }
        return counter;
      })
    );
  };

  const countDown = async (id: string) => {
    setCounters((counters) =>
      counters.map((counter) => {
        if (counter.id === id) {
          const newCounts = counter.value - counter.amount;
          if (newCounts >= counter.minValue) {
            return { ...counter, value: newCounts };
          }
        }
        return counter;
      })
    );
  };

  const resetCount = async (id: string) => {
    setCounters((counters) =>
      counters.map((counter) => {
        if (counter.id === id) {
          return { ...counter, value: counter.startWith };
        }
        return counter;
      })
    );
  };

  const clearCounters = () => {
    setCounters([]);
  };

  return {
    counters,
    addCounter,
    removeCounter,
    editCounter,
    countUp,
    countDown,
    resetCount,
    clearCounters,
  };
}

// https://usehooks.com/useLocalStorage/
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: ((s: T) => T) | T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: ((s: T) => T) | T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {}
  };

  return [storedValue, setValue];
}
