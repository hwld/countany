import { ListItemIcon, Menu, MenuItem, Typography } from "@material-ui/core";
import { User } from "next-auth";
import React, { useState } from "react";
import styled from "styled-components";
import LogoutIcon from "@material-ui/icons/ExitToApp";

type Props = { user: User; onLogout: () => void; className?: string };

const Component: React.FC<Props> = ({ user, onLogout, className }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const close = () => {
    setAnchorEl(null);
  };

  return (
    <div className={className}>
      <button onClick={open}>
        <img src={user.image} />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <Typography>ログアウト</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

const StyledComponent = styled(Component)`
  margin: 2px 0;
  width: 44px;
  height: 44px;

  & > button {
    padding: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: none;
    outline: none;

    & > img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
`;

export const AccountButton = StyledComponent;
