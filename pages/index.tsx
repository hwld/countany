import React, { useState } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { CounterContainer } from "../components/CounterContainer";
import { CounterFields, CounterObj } from "../components/Counter";

import { AddCounterButton } from "../components/AddCounterButton";

const Home: React.FC<{ className?: string }> = ({ className }) => {
  const [counters, setCounters] = useState<CounterObj[]>([]);

  const addCounter = (fields: CounterFields) => {
    setCounters((counters) => [
      ...counters,
      {
        id: Math.random().toString(),
        name: `新しいカウンター`,
        value: 0,
        startWith: 0,
        amount: 1,
        maxValue: 100,
        minValue: -100,
      },
    ]);
  };

  const removeCounter = (id: string) => {
    setCounters((state) => [...state.filter((state) => state.id !== id)]);
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
          countUp={countUp}
          countDown={countDown}
          resetCount={resetCount}
          removeCounter={removeCounter}
        />
      </Main>
      <AddCounterButton addCounter={addCounter} className="addCounter" />
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
