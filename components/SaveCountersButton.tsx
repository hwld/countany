import React from "react";
import BackupIcon from "@material-ui/icons/Backup";
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
    <Tooltip title={<Typography>アカウントに保存</Typography>} placement="left">
      <Fab color="primary" onClick={save} className={className}>
        <BackupIcon></BackupIcon>
      </Fab>
    </Tooltip>
  );
};

export const SaveCountersButton = Component;
