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
  onAddCounter: (fields: CounterFields) => void;
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
    onAddCounter(fields);
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
