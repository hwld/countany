import { useState } from "react";
import useSWR from "swr";

import { CounterFields } from "../components/Counter";
import { Counter } from "../types/client";
import { Fetcher } from "../util/fetcher";
import { useLocalStorage } from "./useLocalStorage";

export type useCountersResult = {
  counters: Counter[];
  error: useCountersError;
  addCounter: (counter: Counter) => Promise<void>;
  removeCounter: (id: string) => Promise<void>;
  editCounter: (id: string, fields: CounterFields) => Promise<void>;
  countUp: (id: string) => Promise<void>;
  countDown: (id: string) => Promise<void>;
  resetCount: (id: string) => Promise<void>;
};

type useRemoteCountersResult = useCountersResult & {
  addCounters: (counters: Counter[]) => Promise<void>;
};

type useLocalCountersResult = useCountersResult & {
  clearCounters: () => void;
};

type useCountersError = null | { message: string };

// web apiを使用したバージョン
export function useRemoteCounters(fetcher: Fetcher): useRemoteCountersResult {
  const { data: counters = [], mutate } = useSWR<Counter[]>(
    "/api/counters",
    fetcher
  );
  const [error, setError] = useState<useCountersError>(null);

  const setErrorAndClear = (error: useCountersError, clearTimeout: number) => {
    setError(error);
    setTimeout(() => {
      setError(null);
    }, clearTimeout);
  };

  const addCounter = async (counter: Counter) => {
    try {
      mutate([...counters, counter], false);
      await fetcher("/api/counter/create", counter);
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear(
        { message: "カウンターの追加でエラーが発生しました。" },
        5000
      );
    }
  };

  const addCounters = async (newCounters: Counter[]) => {
    try {
      mutate([...counters, ...newCounters], false);
      await fetcher("/api/counters/bulk_create", newCounters);
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear(
        { message: "複数のカウンターの追加でエラーが発生しました。" },
        5000
      );
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
      setErrorAndClear(
        { message: "カウンターの削除でエラーが発生しました。" },
        5000
      );
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
      setErrorAndClear(
        { message: "カウンターの編集でエラーが発生しました。" },
        5000
      );
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
        ...target,
        value: target.value + target.amount,
      });
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear(
        { message: "カウントアップでエラーが発生しました。" },
        5000
      );
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
        ...target,
        value: target.value - target.amount,
      });
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear(
        { message: "カウントダウンでエラーが発生しました。" },
        5000
      );
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
      await fetcher("/api/counter/update", { ...target, value: 0 });
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear(
        { message: "カウンターのリセットでエラーが発生しました。" },
        5000
      );
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
    addCounters,
  };
}

// localStorageを使用したバージョン
export function useLocalCounters(): useLocalCountersResult {
  const [counters, setCounters] = useLocalStorage<Counter[]>("counters", []);
  const [error, setError] = useState<useCountersError>(null);

  const setErrorAndClear = (error: useCountersError, clearTimeout: number) => {
    setError(error);
    setTimeout(() => {
      setError(null);
    }, clearTimeout);
  };

  const addCounter = async (counter: Counter) => {
    try {
      setCounters((counters) => [...counters, counter]);
    } catch (error) {
      setErrorAndClear(
        { message: "カウンターの追加でエラーが発生しました。" },
        5000
      );
    }
  };

  const removeCounter = async (id: string) => {
    try {
      setCounters((counters) => counters.filter((c) => c.id !== id));
    } catch (error) {
      setErrorAndClear(
        { message: "カウンターの削除でエラーが発生しました。" },
        5000
      );
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
      setErrorAndClear(
        { message: "カウンターの編集でエラーが発生しました。" },
        5000
      );
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
      setErrorAndClear(
        { message: "カウントアップでエラーが発生しました。" },
        5000
      );
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
      setErrorAndClear(
        { message: "カウントダウンでエラーが発生しました。" },
        5000
      );
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
      setErrorAndClear(
        { message: "カウンターのリセットでエラーが発生しました。" },
        5000
      );
    }
  };

  const clearCounters = () => {
    try {
      setCounters([]);
    } catch (error) {
      setErrorAndClear(
        { message: "カウンターのクリアでエラーが発生しました。" },
        5000
      );
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
