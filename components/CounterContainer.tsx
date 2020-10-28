import React from "react";
import styled from "styled-components";
import { Counter, CounterObj } from "./Counter";

type Props = {
  className?: string;
  counters: CounterObj[];
  removeCounter: (id: string) => void;
};

const Component: React.FC<Props> = ({ className, counters, removeCounter }) => {
  return (
    <div className={className}>
      {counters.map((counter) => (
        <Counter
          key={counter.id}
          className="counter"
          counter={counter}
          removeCounter={removeCounter}
        ></Counter>
      ))}
    </div>
  );
};

const StyledComponent = styled(Component)`
  margin: 20px 100px 0 20px;
  display: flex;
  flex-wrap: wrap;

  & > .counter {
    margin: 5px;
  }
`;

export const CounterContainer = StyledComponent;
