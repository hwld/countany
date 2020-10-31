import { Button, IconButton, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import PlusIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";
import ResetIcon from "@material-ui/icons/Refresh";
import SettingIcon from "@material-ui/icons/Settings";
import RemoveIcon from "@material-ui/icons/Clear";

export type CounterObj = {
  // マイナス記号を入れて10桁までの表示をサポートしている.
  id: string;
  name: string;
  value: number;
  startWith: number;
  countAmount: number; //変化量
  maxValue: number; //10桁の表示までサポート
  minValue: number; //10桁
};

type Props = {
  className?: string;
  counter: CounterObj;
  countUp: (id: string) => void;
  countDown: (id: string) => void;
  resetCount: (id: string) => void;
  removeCounter: (id: string) => void;
};

const Component: React.FC<Props> = ({
  className,
  counter,
  countUp: up,
  countDown: down,
  resetCount: reset,
  removeCounter,
}) => {
  const countUp = () => {
    up(counter.id);
  };

  const countDown = () => {
    down(counter.id);
  };

  const resetCount = () => {
    reset(counter.id);
  };

  const remove = () => {
    removeCounter(counter.id);
  };

  return (
    <div className={className}>
      <div className="head">
        <Typography className="title">{counter.name}</Typography>
        <IconButton onClick={remove} className="remove" color="secondary">
          <RemoveIcon />
        </IconButton>
      </div>
      <Typography className="counts">{counter.value}</Typography>
      <div className="counter">
        <Button
          onClick={countUp}
          className="countUp"
          variant="contained"
          color="primary"
        >
          <PlusIcon fontSize="large" />
        </Button>
        <Button
          onClick={countDown}
          className="countDown"
          variant="contained"
          color="primary"
        >
          <MinusIcon fontSize="large" />
        </Button>
      </div>
      <div className="options">
        <IconButton onClick={resetCount} className="reset" color="secondary">
          <ResetIcon fontSize="large" />
        </IconButton>
        <IconButton className="setting" color="secondary">
          <SettingIcon fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
};

const StyledComponent = styled(Component)`
  width: 310px;
  height: 300px;
  border: solid 2px ${(props) => props.theme.palette.primary.main};
  border-radius: 10px;
  background-color: transparent;
  display: flex;
  flex-direction: column;

  & > .remove {
    margin: 0 0 auto auto;
    & svg {
      font-size: 40px;
    }
  }

  & > .head {
    height: 80px;
    display: flex;
    align-items: start;
    justify-content: space-between;

    & > .title {
      margin: 10px 0 0 20px;
      font-size: 20px;
      word-break: break-all;
    }
  }

  & > .counts {
    margin-top: 0px;
    font-size: 50px;
    text-align: center;
  }

  & > .counter {
    margin: 0px auto 0 auto;

    & > button {
      width: 80px;
      height: 80px;
    }

    & > .countUp {
      border-radius: 90% 0% 0% 90%;
    }

    & > .countDown {
      border-radius: 0% 90% 90% 0%;
    }
  }

  & > .options {
    margin-top: 0px;
    display: flex;
    justify-content: space-between;

    & svg {
      font-size: 30px;
    }
  }
`;

export const Counter = StyledComponent;
