import React from "react";
import SaveIcon from "@material-ui/icons/Save";
import { Fab, Tooltip, Typography } from "@material-ui/core";

type Props = {
  className?: string;
  onSave: () => void;
};

const Component: React.FC<Props> = ({ className, onSave }) => {
  const save = () => {
    onSave();
  };

  return (
    <Tooltip title={<Typography>保存</Typography>} placement="left">
      <Fab color="primary" onClick={save} className={className}>
        <SaveIcon></SaveIcon>
      </Fab>
    </Tooltip>
  );
};

export const SaveCountersButton = Component;
