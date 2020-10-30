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
import { CounterSettingFormFields } from "./CounterSettingFormFields";
import { SlideTransition } from "./SlideTransition";

type Props = {
  className?: string;
  addCounter: () => void;
};

const Component: React.FC<Props> = ({ className, addCounter: add }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const addCounter = () => {
    add();
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
      >
        <DialogTitle>カウンターの追加</DialogTitle>
        <DialogContent>
          <CounterSettingFormFields />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>中止</Button>
          <Button onClick={addCounter}>追加</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const AddCounterButton = Component;
