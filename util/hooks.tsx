import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { CounterFields } from "../components/Counter";
import { Counter } from "../types/client";
import { fetcher } from "./fetcher";

export type useCountersResults = {
  counters: Counter[];
  error: boolean;
  addCounter: (counter: Counter) => Promise<void>;
  removeCounter: (id: string) => Promise<void>;
  editCounter: (id: string, fields: CounterFields) => Promise<void>;
  countUp: (id: string) => Promise<void>;
  countDown: (id: string) => Promise<void>;
  resetCount: (id: string) => Promise<void>;
};

// sessionが存在するかによってlocal,remoteストレージを切り替える.
// 複数の箇所で呼ばれるとログイン時のuseEffectでエラーが起きる.
export function useCounters(): useCountersResults {
  const [session] = useSession();

  const remote = useRemoteCounters();
  const local = useLocalCounters();

  const useCountersResult: useCountersResults = session ? remote : local;

  // sessionが存在し、localstorageにカウンターが存在するときにはカウンターをdbに保存する
  useEffect(() => {
    const moveLocalToRemote = async () => {
      //先にclearして次のレンダリングでlocal.counters.lengthが0になるようにする
      local.clearCounters();
      await remote.addCounters(local.counters);
    };

    if (session && local.counters.length > 0) {
      moveLocalToRemote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return useCountersResult;
}

// web apiを使用したバージョン
function useRemoteCounters(): useCountersResults & {
  addCounters: (counters: Counter[]) => Promise<void>;
} {
  const { data: counters = [], mutate } = useSWR<Counter[]>(
    "/api/counters",
    fetcher
  );
  const [error, setError] = useState(false);

  const addCounter = async (counter: Counter) => {
    mutate([...counters, counter], false);
    await fetcher("/api/counter/create", counter).catch(() => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    });
    mutate();
  };

  const addCounters = async (cs: Counter[]) => {
    mutate([...counters, ...cs], false);
    for (const c of cs) {
      await fetcher("/api/counter/create", c).catch(() => {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      });
    }
    mutate();
  };

  const removeCounter = async (id: string) => {
    mutate(
      counters.filter((c) => c.id !== id),
      false
    );
    await fetcher("/api/counter/delete", { id }).catch(() => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    });
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
    await fetcher("/api/counter/update", { id, ...fields }).catch(() => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    });
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
    }).catch(() => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
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
    }).catch(() => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
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
    await fetcher("/api/counter/update", { id, value: 0 }).catch(() => {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    });
    mutate();
  };

  return {
    counters: counters || [],
    error,
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
function useLocalCounters(): useCountersResults & {
  clearCounters: () => void;
} {
  const [counters, setCounters] = useLocalStorage<Counter[]>("counters", []);
  const [error, setError] = useState(false);

  const addCounter = async (counter: Counter) => {
    try {
      setCounters((counters) => [...counters, counter]);
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  const removeCounter = async (id: string) => {
    try {
      setCounters((counters) => counters.filter((c) => c.id !== id));
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  const editCounter = async (id: string, fields: CounterFields) => {
    try {
      setCounters((counters) =>
        counters.map((counter) => {
          if (counter.id === id) {
            return { ...counter, ...fields };
          }
          return counter;
        })
      );
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  const countUp = async (id: string) => {
    try {
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
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  const countDown = async (id: string) => {
    try {
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
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  const resetCount = async (id: string) => {
    try {
      setCounters((counters) =>
        counters.map((counter) => {
          if (counter.id === id) {
            return { ...counter, value: counter.startWith };
          }
          return counter;
        })
      );
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  const clearCounters = () => {
    try {
      setCounters([]);
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  return {
    counters,
    error,
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
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}
