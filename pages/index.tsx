import React from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { CounterContainer } from "../components/CounterContainer";
import { CounterFields, CounterObj } from "../components/Counter";
import { AddCounterButton } from "../components/AddCounterButton";
import useSWR from "swr";
import { fetcher } from "../components/util/fetcher";
import { Counter } from "@prisma/client";

const Home: React.FC<{ className?: string }> = ({ className }) => {
  const { data: counters = [], mutate } = useSWR<Counter[]>(
    "/api/counters",
    fetcher
  );

  const addCounter = async (fields: CounterFields) => {
    const id = Math.random().toString();
    await fetcher("/api/counter/create", {
      id,
      value: fields.startWith,
      ...fields,
    });
    mutate(
      [
        {
          id,
          value: fields.startWith,
          ...fields,
        },
        ...counters,
      ],
      false
    );
  };

  const removeCounter = async (id: string) => {
    await fetcher("/api/counter/delete", { id });
    await mutate(
      counters.filter((c) => c.id !== id),
      false
    );
  };

  const editCounter = async (id: string, fields: CounterFields) => {
    await fetcher("/api/counter/update", { id, ...fields });
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
  };

  const countUp = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }
    if (target.value + target.amount > target.maxValue) {
      return;
    }

    await fetcher("/api/counter/update", {
      id,
      value: target.value + target.amount,
    });
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
  };

  const countDown = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }
    if (target.value - target.amount < target.minValue) {
      return;
    }

    await fetcher("/api/counter/update", {
      id,
      value: target.value - target.amount,
    });
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
  };

  const resetCount = async (id: string) => {
    const target = counters.find((c) => c.id === id);
    if (!target) {
      return;
    }

    await fetcher("/api/counter/update", { id, value: 0 });
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
