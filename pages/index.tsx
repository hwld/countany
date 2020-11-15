import React from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { CounterContainer } from "../components/CounterContainer";
import { CounterFields, CounterObj } from "../components/Counter";
import { AddCounterButton } from "../components/AddCounterButton";
import useSWR from "swr";
import { fetcher } from "../components/util/fetcher";
import { Counter } from "../types/client";

const Home: React.FC<{ className?: string }> = ({ className }) => {
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
            const newCounter: CounterObj = {
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
            const newCounter: CounterObj = {
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
            const newCounter: CounterObj = {
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
            const newCounter: CounterObj = {
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

  return (
    <div className={className}>
      <Header />
      <Main>
        <CounterContainer
          counters={counters}
          onEditCounter={editCounter}
          onRemoveCounter={removeCounter}
          onCountUp={countUp}
          onCountDown={countDown}
          onResetCount={resetCount}
        />
      </Main>
      <AddCounterButton onAddCounter={addCounter} className="addCounter" />
    </div>
  );
};

const StyledHome = styled(Home)`
  height: 100vh;
  background-color: ${(props) => {
    return props.theme.palette.background.default;
  }};

  & .addCounter {
    position: absolute;
    right: 40px;
    bottom: 40px;
  }
`;

export default StyledHome;
