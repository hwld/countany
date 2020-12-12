import React, { useState } from "react";
import SettingIcon from "@material-ui/icons/Settings";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { CounterSettingForm } from "./CounterSettingForm";
import { SlideTransition } from "./SlideTransition";
import { Counter, CounterFields } from "../models/counter";

type Props = {
  className?: string;
  counter: Counter;
  editCounter: (fields: CounterFields) => void;
};

const Componet: React.FC<Props> = ({ className, counter, editCounter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleSubmit = (fields: CounterFields) => {
    editCounter(fields);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton onClick={open} className={className} color="secondary">
        <SettingIcon />
      </IconButton>
      <Dialog
        open={isOpen}
        onClose={close}
        TransitionComponent={SlideTransition}
        fullWidth
      >
        <DialogTitle>カウンターの編集</DialogTitle>
        <DialogContent>
          <CounterSettingForm
            id="editCounter"
            counter={counter}
            onSubmit={handleSubmit}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>中止</Button>
          <Button form="editCounter" type="submit">
            完了
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const EditCounterButton = Componet;
