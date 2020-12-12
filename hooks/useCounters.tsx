import { useRef, useState } from "react";
import {
  postBulkCreateCounters,
  postCreateCounter,
  postRemoveCounter,
  postUpdateCounter,
  useFetchCounter,
} from "../util/apiRequest";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuid } from "uuid";
import { Counter } from "../models/counter";

export type useCountersResult = {
  counters: Counter[];
  error: useCountersError;
  addCounter: (counter: Counter) => Promise<void>;
  removeCounter: (id: string) => Promise<void>;
  editCounter: (counter: Counter) => Promise<void>;
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
export function useRemoteCounters(): useRemoteCountersResult {
  const { data: counters = [], mutate } = useFetchCounter();
  const [error, setError] = useState<useCountersError>(null);

  // counterIdとtimerIDを関連付ける。
  // timerはカウントアップ、ダウン、リセット時にセットし、最終的なカウンターの結果のみを送信する。
  const timerIdMap = useRef(new Map<string, number>());

  const setErrorAndClear = (error: useCountersError) => {
    setError(error);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const addCounter = async (counter: Counter) => {
    try {
      await postCreateCounter({ ...counter });
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear({ message: "カウンターの追加でエラーが発生しました。" });
    }
  };

  const addCounters = async (newCounters: Counter[]) => {
    try {
      await postBulkCreateCounters(newCounters);
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear({
        message: "複数のカウンターの追加でエラーが発生しました。",
      });
    }
  };

  const removeCounter = async (id: string) => {
    try {
      if (id === "") {
        return;
      }
      timerIdMap.current.delete(id);
      mutate(
        counters.filter((c) => c.id !== id),
        false
      );
      await postRemoveCounter(id);
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear({ message: "カウンターの削除でエラーが発生しました。" });
    }
  };

  const editCounter = async (updated: Counter) => {
    try {
      if (updated.id === "") {
        return;
      }
      mutate(
        counters.map((counter) => {
          if (counter.id === updated.id) {
            const newCounter: Counter = {
              ...counter,
              name: updated.name,
              startWith: updated.startWith,
              amount: updated.amount,
              maxValue: updated.maxValue,
              minValue: updated.minValue,
            };
            return newCounter;
          }
          return counter;
        }),
        false
      );
      await postUpdateCounter(updated);
      mutate();
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear({ message: "カウンターの編集でエラーが発生しました。" });
    }
  };

  const countUp = async (id: string) => {
    if (id === "") {
      return;
    }
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

      let timerId = timerIdMap.current.get(target.id);
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        postUpdateCounter({
          ...target,
          value: target.value + target.amount,
        });
      }, 300);
      timerIdMap.current.set(target.id, timerId);
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear({ message: "カウントアップでエラーが発生しました。" });
    }
  };

  const countDown = async (id: string) => {
    if (id === "") {
      return;
    }
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

      let timerId = timerIdMap.current.get(target.id);
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        postUpdateCounter({
          ...target,
          value: target.value - target.amount,
        });
      }, 300);
      timerIdMap.current.set(target.id, timerId);
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear({ message: "カウントダウンでエラーが発生しました。" });
    }
  };

  const resetCount = async (id: string) => {
    if (id === "") {
      return;
    }
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

      let timerId = timerIdMap.current.get(target.id);
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        postUpdateCounter({ ...target, value: 0 });
      }, 500);
      timerIdMap.current.set(target.id, timerId);
    } catch (error) {
      mutate([...counters], false);
      setErrorAndClear({
        message: "カウンターのリセットでエラーが発生しました。",
      });
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
      setCounters((counters) => [...counters, { ...counter, id: uuid() }]);
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

  const editCounter = async (updated: Counter) => {
    try {
      setCounters((counters) =>
        counters.map((counter) => {
          if (counter.id === updated.id) {
            return { ...counter, ...updated };
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
