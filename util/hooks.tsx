import useSWR from "swr";
import { CounterFields } from "../components/Counter";
import { Counter } from "../types/client";
import { fetcher } from "./fetcher";

export type useCountersResults = {
  counters: Counter[];
  addCounter: (fields: CounterFields) => Promise<void>;
  removeCounter: (id: string) => Promise<void>;
  editCounter: (id: string, fields: CounterFields) => Promise<void>;
  countUp: (id: string) => Promise<void>;
  countDown: (id: string) => Promise<void>;
  resetCount: (id: string) => Promise<void>;
};

export function useCounters(): useCountersResults {
  const { data: counters = [], mutate } = useSWR<Counter[]>(
    "/api/counters",
    fetcher
  );

  const addCounter = async (fields: CounterFields) => {
    const id = Math.random().toString();
    mutate(
      [
        ...counters,
        {
          id,
          value: fields.startWith,
          ...fields,
        },
      ],
      false
    );
    await fetcher("/api/counter/create", {
      id,
      value: fields.startWith,
      ...fields,
    });
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
      [
        ...counters.map((counter) => {
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
      ],
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
      [
        ...counters.map((counter) => {
          if (counter.id === id) {
            const newCounter: Counter = {
              ...counter,
              value: counter.value + counter.amount,
            };
            return newCounter;
          }
          return counter;
        }),
      ],
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
      [
        ...counters.map((counter) => {
          if (counter.id === id) {
            const newCounter: Counter = {
              ...counter,
              value: counter.value - counter.amount,
            };
            return newCounter;
          }
          return counter;
        }),
      ],
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
      [
        ...counters.map((counter) => {
          if (counter.id === id) {
            const newCounter: Counter = {
              ...counter,
              value: counter.startWith,
            };
            return newCounter;
          }
          return counter;
        }),
      ],
      false
    );
    await fetcher("/api/counter/update", { id, value: 0 });
    mutate();
  };

  return {
    counters: counters || [],
    addCounter,
    removeCounter,
    editCounter,
    countUp,
    countDown,
    resetCount,
  };
}
