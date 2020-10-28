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
    setCounters((state) => [
      ...state,
      {
        id: Math.random().toString(),
        title: `新しいカウンター`,
      },
    ]);
  };

  const removeCounter = (id: string) => {
    setCounters((state) => [...state.filter((state) => state.id !== id)]);
  };

  return (
    <div className={className}>
      <Header />
      <Main>
        <CounterContainer counters={counters} removeCounter={removeCounter} />
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
