import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";

const Component: React.FC<{ className?: string }> = () => {
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h5" className="title">
          Countany
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export const Header = Component;
