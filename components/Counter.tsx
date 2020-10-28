import { Button, IconButton, Typography } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import PlusIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";
import ResetIcon from "@material-ui/icons/Refresh";
import SettingIcon from "@material-ui/icons/Settings";
import RemoveIcon from "@material-ui/icons/Clear";

export type CounterObj = { id: string; title: string };

type Props = {
  className?: string;
  counter: CounterObj;
  removeCounter: (id: string) => void;
};

const Component: React.FC<Props> = ({ className, counter, removeCounter }) => {
  const [count, setCount] = useState(0);

  const plus = () => {
    setCount((count) => count + 1);
  };

  const minus = () => {
    setCount((count) => count - 1);
  };

  const reset = () => {
    setCount(0);
  };

  const remove = () => {
    removeCounter(counter.id);
  };

  return (
    <div className={className}>
      <div className="head">
        <Typography className="title">{counter.title}</Typography>
        <IconButton onClick={remove} className="remove" color="secondary">
          <RemoveIcon />
        </IconButton>
      </div>
      <Typography className="count">{count}</Typography>
      <div className="counter">
        <Button
          onClick={plus}
          className="plus"
          variant="contained"
          color="primary"
        >
          <PlusIcon fontSize="large" />
        </Button>
        <Button
          onClick={minus}
          className="minus"
          variant="contained"
          color="primary"
        >
          <MinusIcon fontSize="large" />
        </Button>
      </div>
      <div className="options">
        <IconButton onClick={reset} className="reset">
          <ResetIcon fontSize="large" color="primary" />
        </IconButton>
        <IconButton className="setting">
          <SettingIcon fontSize="large" color="primary" />
        </IconButton>
      </div>
    </div>
  );
};

const StyledComponent = styled(Component)`
  width: 300px;
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
    align-items: center;
    justify-content: space-between;

    & > .title {
      margin: 10px 0 0 10px;
      font-size: 20px;
      word-break: break-all;
    }
  }

  & > .count {
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

    & > .plus {
      border-radius: 90% 0% 0% 90%;
    }

    & > .minus {
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
