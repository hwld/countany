import { Button, IconButton, Typography } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import PlusIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";
import ResetIcon from "@material-ui/icons/Refresh";
import SettingIcon from "@material-ui/icons/Settings";

const Component: React.FC<{ className?: string }> = ({ className }) => {
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

  return (
    <div className={className}>
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
          <ResetIcon fontSize="large" color="secondary" />
        </IconButton>
        <IconButton className="setting">
          <SettingIcon fontSize="large" color="secondary" />
        </IconButton>
      </div>
    </div>
  );
};

const StyledComponent = styled(Component)`
  width: 300px;
  height: 500px;
  border: solid 2px ${(props) => props.theme.palette.primary.main};
  border-radius: 10px;
  background-color: transparent;
  display: flex;
  flex-direction: column;

  & > .count {
    margin-top: 120px;
    font-size: 50px;
    text-align: center;
    color: white;
  }

  & > .counter {
    margin: 100px auto 0 auto;

    & > .plus {
      width: 100px;
      height: 100px;
      border-radius: 90% 0% 0% 90%;
    }

    & > .minus {
      width: 100px;
      height: 100px;
      border-radius: 0% 90% 90% 0%;
    }
  }

  & > .options {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    & svg {
      font-size: 50px;
    }
  }
`;

export const Counter = StyledComponent;
