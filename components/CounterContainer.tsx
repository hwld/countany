import React from "react";
import styled from "styled-components";
import { Counter, CounterFields, CounterObj } from "./Counter";

type Props = {
  className?: string;
  counters: CounterObj[];
  editCounter: (id: string, fields: CounterFields) => void;
  removeCounter: (id: string) => void;
  countUp: (id: string) => void;
  countDown: (id: string) => void;
  resetCount: (id: string) => void;
};

const Component: React.FC<Props> = ({
  className,
  counters,
  editCounter,
  removeCounter,
  countUp,
  countDown,
  resetCount,
}) => {
  return (
    <div className={className}>
      {counters.map((counter) => (
        <Counter
          key={counter.id}
          className="counter"
          counter={counter}
          editCounter={editCounter}
          removeCounter={removeCounter}
          countUp={countUp}
          countDown={countDown}
          resetCount={resetCount}
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
