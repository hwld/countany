import { useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { CounterFields } from "../components/Counter";
import { Counter } from "../types/client";
import { Fetcher, fetcher } from "./fetcher";

type _useCountersOperation = {
  addCounter: (counter: Counter) => Promise<void>;
  removeCounter: (id: string) => Promise<void>;
  editCounter: (id: string, fields: CounterFields) => Promise<void>;
  countUp: (id: string) => Promise<void>;
  countDown: (id: string) => Promise<void>;
  resetCount: (id: string) => Promise<void>;
};

type _useCountersResults = {
  counters: Counter[];
} & _useCountersOperation;

type _useRemoteCountersResults = _useCountersResults & {
  _addCounters: (counters: Counter[]) => Promise<void>;
};

type _useLocalCountersResults = _useCountersResults & {
  _clearCounters: () => void;
  _existsCountersInLocalStorage: () => boolean;
};

export type useCountersErrorType = keyof _useCountersOperation;
export type useCountersError = null | { type: useCountersErrorType };

export type useCountersResults = _useCountersResults & {
  error: useCountersError;
};

// sessionが存在するかによってlocal,remoteストレージを切り替える.
export function useCounters(): useCountersResults {
  const [error, setError] = useState<useCountersError>(null);

  const session = Boolean(useSession()[0]);
  const remote = _useRemoteCounters(fetcher);
  const local = _useLocalCounters();

  const _useCountersResult: _useCountersResults = session ? remote : local;

  // sessionが存在し、localstorageにカウンターが存在するときにはカウンターをdbに保存する
  useEffect(() => {
    const moveLocalToRemote = async () => {
      //先にclearして次のレンダリングでlocal.counters.lengthが0になるようにする
      // awaitの後にするとプロミスが解決されないうちに再レンダリングされたときに二回moveされる
      local._clearCounters();
      await remote._addCounters(local.counters);
    };

    // localStoragenに直接アクセスしてカウンターの存在を確認する。
    if (session && !local._existsCountersInLocalStorage()) {
      moveLocalToRemote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const addCounter: _useCountersResults["addCounter"] = (counter) =>
    _useCountersResult.addCounter(counter).catch(() => {
      setError({ type: "addCounter" });
      setTimeout(() => {
        setError(null);
      }, 5000);
    });

  const removeCounter: _useCountersResults["removeCounter"] = (counter) =>
    _useCountersResult.removeCounter(counter).catch(() => {
      setError({ type: "removeCounter" });
      setTimeout(() => {
        setError(null);
      }, 5000);
    });

  const editCounter: _useCountersResults["editCounter"] = (id, fields) =>
    _useCountersResult.editCounter(id, fields).catch(() => {
      setError({ type: "editCounter" });
      setTimeout(() => {
        setError(null);
      }, 5000);
    });

  const countUp: _useCountersResults["countUp"] = (id) =>
    _useCountersResult.countUp(id).catch(() => {
      setError({ type: "countUp" });
      setTimeout(() => {
        setError(null);
      }, 5000);
    });

  const countDown: _useCountersResults["countDown"] = (id) =>
    _useCountersResult.countDown(id).catch(() => {
      setError({ type: "countDown" });
      setTimeout(() => {
        setError(null);
      }, 5000);
    });

  const resetCount: _useCountersResults["resetCount"] = (id) =>
    _useCountersResult.resetCount(id).catch(() => {
      setError({ type: "resetCount" });
      setTimeout(() => {
        setError(null);
      }, 5000);
    });

  return {
    counters: _useCountersResult.counters,
    error,
    addCounter,
    removeCounter,
    editCounter,
    countUp,
    countDown,
    resetCount,
  };
}

// web apiを使用したバージョン
function _useRemoteCounters(fetcher: Fetcher): _useRemoteCountersResults {
  const { data: counters = [], mutate } = useSWR<Counter[]>(
    "/api/counters",
    fetcher
  );

  const addCounter = async (counter: Counter) => {
    try {
      mutate([...counters, counter], false);
      await fetcher("/api/counter/create", counter);
      mutate();
    } catch (error) {
      mutate([...counters], false);
      throw error;
    }
  };

  const _addCounters = async (newCounters: Counter[]) => {
    try {
      mutate([...counters, ...newCounters], false);
      await fetcher("/api/counters/bulk_create", newCounters);
      mutate();
    } catch (error) {
      mutate([...counters], false);
      throw error;
    }
  };

  const removeCounter = async (id: string) => {
    try {
      mutate(
        counters.filter((c) => c.id !== id),
        false
      );
      await fetcher("/api/counter/delete", { id });
      mutate();
    } catch (error) {
      mutate([...counters], false);
      throw error;
    }
  };

  const editCounter = async (id: string, fields: CounterFields) => {
    try {
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
    } catch (error) {
      mutate([...counters], false);
      throw error;
    }
  };

  const countUp = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }
    if (target.value + target.amount > target.maxValue) {
      return;
    }

    try {
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
    } catch (error) {
      mutate([...counters], false);
      throw error;
    }
  };

  const countDown = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }
    if (target.value - target.amount < target.minValue) {
      return;
    }

    try {
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
    } catch (error) {
      mutate([...counters], false);
      throw error;
    }
  };

  const resetCount = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }

    try {
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
    } catch (error) {
      mutate([...counters], false);
      throw error;
    }
  };

  return {
    counters: counters || [],
    addCounter,
    removeCounter,
    editCounter,
    countUp,
    countDown,
    resetCount,
    _addCounters,
  };
}

// localStorageを使用したバージョン
function _useLocalCounters(): _useLocalCountersResults {
  const [counters, setCounters, getCountersDirectly] = useLocalStorage<
    Counter[]
  >("counters", []);

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

  const _existsCountersInLocalStorage = () => {
    return getCountersDirectly().length === 0;
  };

  const _clearCounters = () => {
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
    _clearCounters,
    _existsCountersInLocalStorage,
  };
}

// https://usehooks.com/useLocalStorage/
function useLocalStorage<T>(
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
