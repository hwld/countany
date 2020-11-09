import React, { useState } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { CounterContainer } from "../components/CounterContainer";
import { CounterFields, CounterObj } from "../components/Counter";

import { AddCounterButton } from "../components/AddCounterButton";

const Home: React.FC<{ className?: string }> = ({ className }) => {
  const testCounter = (): CounterObj => ({
    amount: 1,
    id: Math.random().toString(),
    maxValue: 99999,
    minValue: -99999,
    name: "test",
    startWith: 0,
    value: 0,
  });
  const [counters, setCounters] = useState<CounterObj[]>([
    testCounter(),
    testCounter(),
    testCounter(),
    testCounter(),
    testCounter(),
    testCounter(),
  ]);

  const addCounter = (fields: CounterFields) => {
    setCounters((counters) => {
      const newCounter: CounterObj = {
        id: Math.random().toString(),
        value: fields.startWith,
        ...fields,
      };
      return [...counters, newCounter];
    });
  };

  const removeCounter = (id: string) => {
    setCounters((state) => [...state.filter((state) => state.id !== id)]);
  };

  const editCounter = (id: string, fields: CounterFields) => {
    setCounters((counters) => {
      return [
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
      ];
    });
  };

  const countUp = (id: string) => {
    setCounters((counters) => {
      return [
        ...counters.map((counter) => {
          if (counter.id === id) {
            const newCounts = counter.value + counter.amount;
            if (newCounts <= counter.maxValue) {
              const newCounter: CounterObj = { ...counter, value: newCounts };
              return newCounter;
            }
          }
          return counter;
        }),
      ];
    });
  };

  const countDown = (id: string) => {
    setCounters((counters) => {
      return [
        ...counters.map((counter) => {
          if (counter.id === id) {
            const newCounts = counter.value - counter.amount;
            if (newCounts >= counter.minValue) {
              const newCounter: CounterObj = { ...counter, value: newCounts };
              return newCounter;
            }
          }
          return counter;
        }),
      ];
    });
  };

  const resetCount = (id: string) => {
    setCounters((counters) => {
      return [
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
      ];
    });
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
