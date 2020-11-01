import React from "react";
import styled from "styled-components";
import { Counter, CounterFields, CounterObj } from "./Counter";

type Props = {
  className?: string;
  counters: CounterObj[];
  onEditCounter: (id: string, fields: CounterFields) => void;
  onRemoveCounter: (id: string) => void;
  onCountUp: (id: string) => void;
  onCountDown: (id: string) => void;
  onResetCount: (id: string) => void;
};

const Component: React.FC<Props> = ({
  className,
  counters,
  onEditCounter,
  onRemoveCounter,
  onCountUp,
  onCountDown,
  onResetCount,
}) => {
  return (
    <div className={className}>
      {counters.map((counter) => (
        <Counter
          key={counter.id}
          className="counter"
          counter={counter}
          onEditCounter={onEditCounter}
          onRemoveCounter={onRemoveCounter}
          onCountUp={onCountUp}
          onCountDown={onCountDown}
          onResetCount={onResetCount}
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
