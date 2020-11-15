import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { signIn, signOut, useSession } from "next-auth/client";
import React from "react";
import styled from "styled-components";

const Component: React.FC<{ className?: string }> = ({ className }) => {
  const [session] = useSession();
  console.log("render");

  const login = () => {
    signIn("google");
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <AppBar className={className}>
      <Toolbar>
        <Typography variant="h5" className={`${className}_title`}>
          Countany
        </Typography>
        {session ? (
          <>
            <IconButton className={`${className}_iconButton`}>
              <img src={session.user.image} />
            </IconButton>
            <Button onClick={logout} variant="text" color="default">
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={login} variant="text" color="default">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

const StyledComponent = styled(Component)`
  &_title {
    flex-grow: 1;
  }

  &_iconButton {
    width: 55px;
    height: 55px;
    & img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
    }
  }
`;

export const Header = StyledComponent;
