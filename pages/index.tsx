import { Fab } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import AddIcon from "@material-ui/icons/Add";
import { CounterContainer } from "../components/CounterContainer";
import { CounterObj } from "../components/Counter";

const Home: React.FC<{ className?: string }> = ({ className }) => {
  const [counters, setCounters] = useState<CounterObj[]>([]);

  const addCounter = () => {
    setCounters((counters) => [
      ...counters,
      {
        id: Math.random().toString(),
        title: `新しいカウンター`,
        value: 0,
        startWith: 0,
        countAmount: 1,
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
            const newCounts = counter.value + counter.countAmount;
            console.log(newCounts);
            if (newCounts <= counter.maxValue) {
              return { ...counter, value: newCounts };
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
            const newCounts = counter.value - counter.countAmount;
            if (newCounts >= counter.minValue) {
              return { ...counter, value: newCounts };
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
            return { ...counter, counts: counter.startWith };
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
      <Fab className="addCounter" color="primary" onClick={addCounter}>
        <AddIcon />
      </Fab>
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
