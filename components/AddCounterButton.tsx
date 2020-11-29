import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { CounterSettingForm } from "./CounterSettingForm";
import { SlideTransition } from "./SlideTransition";
import { CounterFields } from "./Counter";
import { Counter } from "../types/client";

type Props = {
  className?: string;
  onAddCounter: (counter: Counter) => void;
};

const Component: React.FC<Props> = ({ className, onAddCounter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleSubmit = (fields: CounterFields) => {
    onAddCounter({ id: "", value: fields.startWith, ...fields });
    setIsOpen(false);
  };

  return (
    <>
      <Tooltip title={<Typography>追加</Typography>} placement="left">
        <Fab color="primary" onClick={open} className={className}>
          <AddIcon />
        </Fab>
      </Tooltip>
      <Dialog
        open={isOpen}
        onClose={close}
        TransitionComponent={SlideTransition}
        fullWidth
      >
        <DialogTitle>カウンターの追加</DialogTitle>
        <DialogContent>
          <CounterSettingForm id="addCounter" onSubmit={handleSubmit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>中止</Button>
          <Button form="addCounter" type="submit">
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const AddCounterButton = Component;
