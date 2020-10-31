import { TextField } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { CounterObj } from "./Counter";

type Props = {
  id: string;
  className?: string;
  counter?: CounterObj;
};

const Component: React.FC<Props> = ({ id, className, counter }) => {
  return (
    <form id={id} className={className}>
      <TextField
        label="カウンター名"
        variant="filled"
        color="secondary"
        value={counter?.name}
      />
      <TextField
        label="初期値"
        type="number"
        variant="filled"
        color="secondary"
        value={counter?.startWith}
      />
      <TextField
        label="増減量"
        type="number"
        variant="filled"
        color="secondary"
        value={counter?.countAmount}
      />
      <TextField
        label="最大値"
        type="number"
        variant="filled"
        color="secondary"
        value={counter?.maxValue}
      />
      <TextField
        label="最小値"
        type="number"
        variant="filled"
        color="secondary"
        value={counter?.minValue}
      />
    </form>
  );
};

const StyledComponent = styled(Component)`
  display: flex;
  flex-direction: column;

  & > div {
    margin-top: 5%;
  }

  & input[type="number"]::-webkit-inner-spin-button,
  & input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const CounterSettingForm = StyledComponent;
