import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { CounterSettingForm } from "./CounterSettingForm";
import { SlideTransition } from "./SlideTransition";
import { CounterFields } from "./Counter";

type Props = {
  className?: string;
  addCounter: (fields: CounterFields) => void;
};

const Component: React.FC<Props> = ({ className, addCounter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleSubmit = (fields: CounterFields) => {
    console.log(fields);
    addCounter(fields);
    setIsOpen(false);
  };

  return (
    <>
      <Fab color="primary" onClick={open} className={className}>
        <AddIcon />
      </Fab>
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
          <Button onClick={close} variant="contained" color="primary">
            中止
          </Button>
          <Button
            form="addCounter"
            type="submit"
            variant="contained"
            color="primary"
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const AddCounterButton = Component;