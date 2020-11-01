import { Button, IconButton, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import PlusIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";
import ResetIcon from "@material-ui/icons/Refresh";
import RemoveIcon from "@material-ui/icons/Clear";
import { EditCounterButton } from "./EditCounterButton";

// 変更可能なフィールド
export type CounterFields = {
  name: string;
  startWith: number;
  amount: number; //変化量
  maxValue: number; //10桁の表示までサポート
  minValue: number; //10桁
};
export type CounterObj = {
  // マイナス記号を入れて10桁までの表示をサポートしている.
  id: string;
  value: number;
} & CounterFields;

export const counterMaxLength = 10;

type Props = {
  className?: string;
  counter: CounterObj;
  onEditCounter: (id: string, fields: CounterFields) => void;
  onRemoveCounter: (id: string) => void;
  onCountUp: (id: string) => void;
  onCountDown: (id: string) => void;
  onResetCount: (id: string) => void;
};

const Component: React.FC<Props> = ({
  className,
  counter,
  onEditCounter,
  onRemoveCounter,
  onCountUp,
  onCountDown,
  onResetCount,
}) => {
  const countUp = () => {
    onCountUp(counter.id);
  };

  const countDown = () => {
    onCountDown(counter.id);
  };

  const resetCount = () => {
    onResetCount(counter.id);
  };

  const removeCounter = () => {
    onRemoveCounter(counter.id);
  };

  const editCounter = (fields: CounterFields) => {
    onEditCounter(counter.id, fields);
  };

  return (
    <div className={className}>
      <div className="head">
        <Typography className="title">{counter.name}</Typography>
        <IconButton
          onClick={removeCounter}
          className="remove"
          color="secondary"
        >
          <RemoveIcon />
        </IconButton>
      </div>
      <Typography className="counts">{counter.value}</Typography>
      <div className="counter">
        <Button onClick={countUp} className="countUp">
          <PlusIcon fontSize="large" />
        </Button>
        <Button onClick={countDown} className="countDown">
          <MinusIcon fontSize="large" />
        </Button>
      </div>
      <div className="options">
        <IconButton onClick={resetCount} className="reset" color="secondary">
          <ResetIcon />
        </IconButton>
        <EditCounterButton counter={counter} editCounter={editCounter} />
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
